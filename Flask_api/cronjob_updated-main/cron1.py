import time
import subprocess
from crontab import CronTab

interval = int(input("Enter time interval"))

#with open('/home/jeevesh/input.txt','r') as file:
#	interval=int(file.readline().strip())
cron = CronTab(user=True)

command = f'python3 /home/jeevesh/cron/hello.py'
job = cron.new(command=command)

job.every(interval)

cron.write()

while True:
	subprocess.run(['python3','/home/jeevesh/hi.py'], check=True)
	
	time.sleep(interval)
