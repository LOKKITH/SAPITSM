from flask import Flask, jsonify, request,json
from crontab import CronTab
from flask_cors import CORS
from pymongo import MongoClient
from flask_pymongo import PyMongo
from bson import json_util


app = Flask(__name__)
#app.config['MONGO_URI'] ='mongodb+srv://sap.jecebdf.mongodb.net/" --apiVersion 1 --username Rohit'
app.config['MONGO_URI']  = 'mongodb+srv://Rohit:Bloodhound@sap.jecebdf.mongodb.net/<database_name>?retryWrites=true&w=majority'
CORS(app)

# MongoDB connection settings
mongodb_url = 'mongodb://localhost:27017'
mongodb_auth_database = 'auth'
mongodb_auth_collection = 'cred'
mongodb_sapdb_database = 'sapdb'
mongodb_collection_tableone = 'controls'
mongodb_collection_tabletwo = 'servers'

# Connect to MongoDB for authentication
auth_client = MongoClient(mongodb_url)
auth_db = auth_client[mongodb_auth_database]
auth_collection = auth_db[mongodb_auth_collection]

# Connect to MongoDB for other operations
sapdb_client = MongoClient(mongodb_url)
sapdb_db = sapdb_client[mongodb_sapdb_database]
sapdb_collection_one = sapdb_db[mongodb_collection_tableone]
sapdb_collection_two = sapdb_db[mongodb_collection_tabletwo]

class CronJobManager:
    def __init__(self):
        # self.cron = CronTab(user=True)
        self.cron = CronTab(user=True)


    def add_cron(self,function_name,schedule,unique_id,server):
        command = f'/usr/bin/python3 /home/lokkith/Documents/SAP/Flask_api/control_cron.py {function_name} {server} {unique_id}>> /home/lokkith/Documents/SAP/backup.log 2>&1'

    #         # Add a new cron job with the unique ID
        #print("command",command)

        job = self.cron.new(command=command)
        job.set_comment(unique_id)
        job.setall(schedule)
        #print('jiob')
        self.cron.write()
        #print('success')
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
        hours, minutes  = time.split(':')
        
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

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']

    # Check if the user already exists
    existing_user = auth_collection.find_one({'email': email})
    if existing_user:
        return jsonify({'message': 'User already exists'})

    # Insert the new user into the MongoDB collection
    auth_collection.insert_one({'email': email, 'password': password})

    return jsonify({'message': 'Signup successful'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Retrieve the user document from the MongoDB collection
    user = auth_collection.find_one({'email': email})

    if user and user['password'] == password:
    # Authentication successful
        return jsonify({'message': 'Login successful'})
    else:
    # Authentication failed
        return jsonify({'message': 'Invalid credentials'})

@app.route('/api/controls', methods=['GET'])
def get_controls():
    try:
    # Fetch data from MongoDB
        controls = list(sapdb_collection_one.find({}, {'_id': 0}))
        print(controls)

        return jsonify(controls)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/controls', methods=['POST'])
def add_control():
    try:
        data = request.get_json()

        # Insert data into MongoDB
        sapdb_collection_one.insert_one(data)

        return jsonify({'message': 'Control added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/controls/<control_id>', methods=['DELETE'])
def delete_control(control_id):
    try:
    # Delete data from MongoDB
        sapdb_collection_one.delete_one({'EventID': control_id})

        return jsonify({'message': 'Control deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/servers', methods=['GET'])
def get_servers():
    try:
    # Fetch data from MongoDB
        servers = list(sapdb_collection_two.find({}, {'_id': 0}))
        print(servers)

        return jsonify(servers)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/servers', methods=['POST'])
def add_server():
    try:
        data = request.get_json()
        #dfdsf

        # Insert data into MongoDB
        sapdb_collection_two.insert_one(data)

        return jsonify({'message': 'Server added successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/servers/<server_id>', methods=['DELETE'])
def delete_server(server_id):

    try:
    # Delete data from MongoDB
        sapdb_collection_two.delete_one({'serverslist': server_id})

        return jsonify({'message': 'Server deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scheduledjob', methods=['POST','GET'])
def handle_api_request():
    client=MongoClient(app.config['MONGO_URI'])
    db=client['scheduler']
    collection=db['backend']
    data = request.get_json()
    ID="Req1"
    print("data",data)

    # Process the received data
    Controls = data.get('Control')
    Controls=[control['label'] for control in Controls]
    Servers = data.get('Severname')
    #servers = data.get('Servers')
    time = data.get('Start_Time')
    #interval = data.get('Interval')

    print("servers:",Servers)
    print("controls:",Controls)
    print("time:",time)

    schedule=manager.convert_to_cron(time)

    # Perform any necessary operations with the data

    # Create a response data dictionary
    response_data = {
    'message': 'API request received successfully',
    'Controls': Controls,
    'Servers': Servers,
    'time': time
    }
    result=str(collection.insert_one(response_data))
    # serialized_result = json_util.dumps(result)
    # temp=json.loads(serialized_result)
    # print(temp)
    print("result",result)
    print('Data received successfully via API request.')
    print("servers:",Servers)
    print("controls:",Controls)
    print("time:",schedule)
    # if isinstance(Controls,list):
    #     for i in range(len(Controls)):
    #         print(Controls[i])
    #         manager.add_cron(Controls[i],schedule,ID,Servers)
    # elif isinstance(Controls,str):
    #     manager.add_cron(Controls,schedule,ID,Servers)
            
    # else:
    #     return jsonify(error="Invalid controls"), 400
    
    ######################
    #need to check if its ok to run multiple controls at the same time on the server
    for i in range(len(Servers)):
        for j in range(len(Controls)):
            rr = manager.add_cron(Controls[j],schedule,ID,Servers[i])

        else:
            return jsonify(error="Invalid controls"), 400
    
    return "cron jobs scheduled successfully"


    # Return the response data as JSON
    #return jsonify(result)
    # data = request.get_json()
    # # Process the JSON data as needed
    # # Example: Save data to a database, perform some operations, etc.
    # print(data)
    
    # # Return a JSON response instead of plain text
    return jsonify({"message": "Data received successfully"})

if __name__ == '__main__':
    app.run()