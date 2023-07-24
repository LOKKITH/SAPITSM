import sys
  
def main(args):
    file_path = "/home/jeevesh/cron/world.txt"
    with open(file_path, 'a') as file:
        file.write(str(args[1]) + " world \n")
    print("world")
  
if __name__ == '__main__':
    main(sys.argv)