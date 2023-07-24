from crontab import CronTab
import random

class CronJobManager:
    def __init__(self):
        self.cron = CronTab(user=True)> /home/jeevesh/backup.log 2>&1

    def add_cron_job(self, program_names, unique_id, schedule):
        # Iterate over the program names and create a cron job for each
        for program_name in program_names:
            # Construct the command for running the program
            command = f'/usr/bin/python3 /home/jeevesh/cron/{program_name}.py {unique_id} > /home/jeevesh/backup.log 2>&1'

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
    
    def print_cron_job(self):
        for job in self.cron:
            print(job)


manager = CronJobManager()
program_names = ['hello','world','hi']
unique_id = str(random.randint(1000,9999))
schedule = '*/1 * * * *'
manager.add_cron_job(program_names, unique_id, schedule)  # Add cron jobs for multiple programs with the same unique ID
#manager.print_cron_job()
#manager.delete_cron_job(unique_id)  # Delete the cron jobs with the unique ID
