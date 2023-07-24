from flask import Flask, request, jsonify,json
from crontab import CronTab
import random
import urllib
from pymongo import MongoClient
from bson import json_util


app=Flask(__name__)

username = urllib.parse.quote_plus('SAPITSM')
password = urllib.parse.quote_plus('Azureuser@123')
connection_string = f'mongodb://{username}:{password}@20.204.156.83:27017'
client = MongoClient(connection_string)
db = client['sample']
collection=db['flask']

class CronJobManager:
    def __init__(self):
        # self.cron = CronTab(user=True)
        self.cron = CronTab(user=True)


    def add_cron(self,function_name,schedule,unique_id,server):
        command = f'/usr/bin/python3 /home/lokkith/Documents/sap-itsm/Final_SAP_Demo/Flask_api/control_cron.py {function_name} {server} {unique_id}>> /home/lokkith/Documents/sap-itsm/backup.log 2>&1'

    #         # Add a new cron job with the unique ID
        job = self.cron.new(command=command)
        job.set_comment(unique_id)
        job.setall(schedule)
        self.cron.write()
        return 'Cron jobs created successfully'


    def delete_cron_job(self, unique_id):
        # Iterate over each cron job
        for job in self.cron:
            # Check if the job's comment matches the unique ID
            if job.comment == unique_id:
                # Remove the job
                self.cron.remove(job)

        # Write the updated crontab
        self.cron.write()

    def convert_to_cron(self,time):
    # Split the time into hours and minutes
        hours, minutes = time.split(':')
        
        # Validate the input
        if not hours.isdigit() or not minutes.isdigit():
            raise ValueError("Invalid time format. Please provide time in HH:MM format.")
        
        # Convert hours and minutes to integers
        hours = int(hours)
        minutes = int(minutes)
        
        # Validate the range of hours and minutes
        if hours < 0 or hours > 23 or minutes < 0 or minutes > 59:
            raise ValueError("Invalid time range. Hours should be between 0 and 23. Minutes should be between 0 and 59.")
        
        # Convert hours and minutes to cron job expression format
        cron_expression = f"{minutes} {hours} * * *"
        
        return cron_expression

manager = CronJobManager()

@app.route('/create_cron_jobs', methods=['POST'])
def create_cron_jobs():
    
    ID=request.json.get('id')
    schedule=request.json.get('interval')

    print(schedule)

    schedule=manager.convert_to_cron(schedule)

    print("schedule in cron",schedule)

    result = list(collection.find({"id":ID}))
    serialized_result = json_util.dumps(result)
    temp=json.loads(serialized_result)
    controls=temp[0]['control']
    server=temp[0]['server']

    print("Controls",controls)
    print("Servers:",server)

    #control will have control name and schedule will have the time and id is unique job id
    if isinstance(controls,list):
        for i in range(len(controls)):
            print(controls[i])
            manager.add_cron(controls[i],schedule,ID,server)
    elif isinstance(controls,str):
        manager.add_cron(controls,schedule,ID,server)
            
    else:
        return jsonify(error="Invalid controls"), 400
    
    return "cron jobs scheduled successfully"

@app.route('/delete_cron_jobs',methods=['POST'])
def delete_cron_jobs():
    id=request.json.get('id')
    manager.delete_cron_job(id)
    return "cron job is deleted successfully"

if __name__ == '__main__':
    app.run()
