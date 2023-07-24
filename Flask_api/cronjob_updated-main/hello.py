import sys
  
def main(args):
    file_path = "/home/jeevesh/cron/hello.txt"
    with open(file_path, 'a') as file:
        file.write(str(args[1]) + " hello \n")
  
if __name__ == '__main__':
    main(sys.argv)