import sys
  
def main(args):
    file_path = "/home/jeevesh/cron/hi.txt"
    with open(file_path, 'a') as file:
        file.write(str(args[1]) + " hi \n")
  
if __name__ == '__main__':
    main(sys.argv)
