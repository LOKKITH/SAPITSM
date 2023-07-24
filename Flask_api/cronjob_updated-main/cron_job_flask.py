from flask import Flask, request
from crontab import CronTab
import random
from flask import Flask, request, jsonify, current_app
#from apscheduler.schedulers.background import BackgroundScheduler
from utils.sap_itsm_utils import *
from controls.bus001 import *
from controls.itsec001 import *
from controls.mc_mm_p003 import *
from controls.mc_mm_p006 import *
from controls.mc_sd_s002 import *
from bson import json_util

app = Flask(__name__)

def BUS001():
    # Implement your logic for the BUS001 function here
    control1 = BussCtrl_001()
    # This is just a placeholder function for demonstration purposes
    print("Running BUS001 function")
    
    control1.bus001Execute()

def ITSEC_001():
    # Implement your logic for the BUS001 function here
    control2 = ITSEC001()
    # This is just a placeholder function for demonstration purposes
    print("Running ITSEC001 function")
    
    control2.itsecExecute()

def MCMMP033():
    # Implement your logic for the BUS001 function here
    control3 = MC_MM_P003()
    # This is just a placeholder function for demonstration purposes
    print("Running MCMMP033 function")
    
    control3.p003Execute()

def MCMMP006():
    # Implement your logic for the BUS001 function here
    control4 = MC_MM_P006()
    # This is just a placeholder function for demonstration purposes
    print("Running MCMMP006 function")
    
    control4.p006Execute()

def MCSDS002():
    # Implement your logic for the BUS001 function here
    control5 = MC_SD_S002()
    # This is just a placeholder function for demonstration purposes
    print("Running MCSDS002 function")
    
    control5.s002Execute()

class CronJobManager:
    def __init__(self):
        # self.cron = CronTab(user=True)
        self.cron = CronTab(user=True)

    def add_cron_job(self, program_names, unique_id, schedule):
        # Iterate over the program names and create a cron job for each
        for program_name in program_names:
            # Construct the command for running the program
            command = f'/usr/bin/python3 /home/lokkith/Documents/sap-itsm/Final_SAP_Demo/Flask_api/cronjob_updated-main/controls/bus001.py >> /home/lokkith/Documents/sap-itsm/backup.log 2>&1'

            # Add a new cron job with the unique ID
            job = self.cron.new(command=command)
            job.set_comment(unique_id)

            # Set the cron schedule
            job.setall(schedule)

        # Write the updated crontab
        self.cron.write()

    def delete_cron_job(self, unique_id):
        # Iterate over each cron job
        for job in self.cron:
            # Check if the job's comment matches the unique ID
            if job.comment == unique_id:
                # Remove the job
                self.cron.remove(job)

        # Write the updated crontab
        self.cron.write()

manager = CronJobManager()

@app.route('/create_cron_jobs', methods=['POST'])
def create_cron_jobs():
    program_names = request.json.get('program_names')
    unique_id = str(random.randint(1000, 9999))
    schedule = request.json.get('schedule')

    manager.add_cron_job(program_names, unique_id, schedule)
    return 'Cron jobs created successfully'

if __name__ == '__main__':
    app.run()
