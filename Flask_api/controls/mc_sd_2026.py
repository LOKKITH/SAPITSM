from utils.text_to_json_util import *
from utils.sap_itsm_utils import *
import pandas as pd
from datetime import datetime
import ast
import json

class MC_SD_2026(object):
    
    def __init__(self,server) -> None:
        
        self.utils = Utilities()
        #creds_fileName = "config/sap_cred.json"
        creds_fileName = "/home/lokkith/Documents/SAP/config/sap_cred.json"
        self.rfc_creds = self.utils.read_json_file1(creds_fileName,server)
        
        return
    pd.set_option('display.max_rows',None)

    def Sd2026_Execute(self):
        
        exc_data_invoice,exc_data_payment = self.l1_mcsd2026()

        print("No of records of exceptional invoice -----> ",len(exc_data_invoice))
        print("No of records of exceptional payment -----> ",len(exc_data_payment))
        if(len(exc_data_invoice)>0):
            print('-------------------------------------------------------Exceptional Invoice-------------------------------------------------------------')
            print(exc_data_invoice)
        else:
            #print('-------------------------------------------------------Exceptional Invoice-------------------------------------------------------------')
            print('No exceptional data found for invoice')
        if(len(exc_data_payment)>0):
            print('-------------------------------------------------------Exceptional Payment-------------------------------------------------------------')
            print(exc_data_payment)
        else:
            #print('-------------------------------------------------------Exceptional Payment-------------------------------------------------------------')
            print('No exceptional data found for payment')
        
        #sd2026_jsondata = self.convert_df_to_json(exc_data)
        # sd2026_jsondata_c = self.utils.convert_df_to_json(exc_data)
        
        # sd2026_jsondata_d = self.utils.convert_df_to_json(exc_data)
        
        # print("mcsd2026 json data --> ", sd2026_jsondata_c)
        
        # sd2026_uniqueid_c = self.mcsd2026_create_uniqueid(sd2026_jsondata_c)

        # sd2026_uniqueid_d = self.mcsd2026_create_uniqueid(sd2026_jsondata_d)
        
        # print("SD2026 unique ids --> ", sd2026_uniqueid_c)
        check_db_in, check_db_pay = self.mcsd2026_checkdb(exc_data_invoice, exc_data_payment)
        
        return
    
    def l1_mcsd2026(self):
        
        # ["bukrs","belnr","blart","budat","usnam","tcode"]
        bkpf_fields = ['BUKRS', 'BELNR', 'BLART', 'BUDAT', 'USNAM', 'TCODE']
        bkpf_options = []
        # ["kunnr","belnr","saknr"]
        bseg_fields = ['KUNNR', 'BELNR', 'HKONT']
        bseg_options = []
        
        
        # read the environment variable
        env_var = os.environ["Deployment"]
        
        # Check if the deployment is for dev or for prod        
        if env_var == 'DEV' :
            # set the file path            
            print("--------------------- Accessing Excel files ---------------------") 
          
            bkpf_read = pd.read_excel('/home/lokkith/Documents/SAP/Flask_api/dummydata/mc_sd_2026/bkpf_invoice.XLSX')
            bseg_read = pd.read_excel('/home/lokkith/Documents/SAP/Flask_api/dummydata/mc_sd_2026/bseg_invoice.XLSX')
            bkpf_read1 = pd.read_excel('/home/lokkith/Documents/SAP/Flask_api/dummydata/mc_sd_2026/bkpf_payment.XLSX')
            bseg_read2 = pd.read_excel('/home/lokkith/Documents/SAP/Flask_api/dummydata/mc_sd_2026/bseg_payment.xlsx')
                
        elif env_var == 'PROD' :
            # get the data from SAP table            
            print("------------------------Accessing SAP server------------------------")
        
            

            bkpf_read = pd.read_json(self.utils.get_rfc_read_table_for_fields(self.rfc_creds, 'BKPF', bkpf_fields, bkpf_options)['DATA'])    
            bseg_read = pd.read_json(self.utils.get_rfc_read_table_for_fields(self.rfc_creds, 'BSEG', bseg_fields, bseg_options)['DATA'])       

        # Selecting require fields from excel
    
        bkpf=bkpf_read[["Company Code", "Document Number","Document type","Posting Date", "User Name", "Transaction Code"]]
        bkpf1=bkpf_read1[["Company Code", "Document Number","Document type","Posting Date", "User Name", "Transaction Code"]]
        bseg=bseg_read[["Company Code","Customer", "Document Number", "G/L Account"]]
        bseg1=bseg_read2[["Company Code","Customer", "Document Number", "G/L Account"]]

        exception1=[]
        exception2=[]

        # Filtering Common Document Number from BKPF and BSEG Table

        df=pd.merge(bkpf,bseg,on=['Document Number', 'Company Code'],how='inner')

        df=df.drop_duplicates()
        #print(df)
        
        df1=pd.merge(bkpf1,bseg1,on=['Document Number', "Company Code"], how='inner')
        df1=df1.drop_duplicates()
        
        # Converting to JSON format to create Unique ID

        sd2026_jsondata_c = self.utils.convert_df_to_json(df)
        
        sd2026_jsondata_d = self.utils.convert_df_to_json(df1)
        
        sd2026_uniqueid_c = self.mcsd2026_create_uniqueid(sd2026_jsondata_c)

        sd2026_uniqueid_d = self.mcsd2026_create_uniqueid(sd2026_jsondata_d)
        

        final_df_c=pd.DataFrame(sd2026_jsondata_c)
        #print(len(final_df_c))

        final_df_d=pd.DataFrame(sd2026_jsondata_d)
        #print(len(final_df_d))
        output_c=[]
        output_d=[]
        #Filtering Common user based in Company code, unique id, posting Date
        if len(final_df_c)>0 and len(final_df_d)>0:
            for _, bkpf_a in final_df_c.iterrows():
                for _, bkpf_b in final_df_d.iterrows():

                    if (bkpf_a["User Name"]==bkpf_b["User Name"]) & (bkpf_a["Company Code"]==bkpf_b["Company Code"]) & (bkpf_a["uqid"]==bkpf_b["uqid"]) & (bkpf_a["Posting Date"]==bkpf_b["Posting Date"]):
                        ls_final={
                            "Document Number" :bkpf_a['Document Number'],
                            "User Name": bkpf_a["User Name"],
                            "Company Code":bkpf_a["Company Code"],
                            "uqid":bkpf_a["uqid"]
                        }
                        exception1.append(ls_final)
                        ls_final1={
                            "Document Number" :bkpf_b['Document Number'],
                            "User Name": bkpf_b["User Name"],
                            "Company Code":bkpf_b["Company Code"],
                            "uqid":bkpf_b["uqid"]
                        }
                        exception2.append(ls_final1)
            data1=pd.DataFrame(exception1)
            data2=pd.DataFrame(exception2)
            data1=data1.drop_duplicates()
            data2=data2.drop_duplicates()
            # print(len(data1))
            # print(len(data2))
            #print(len(data2))
            #print((data1.to_excel(b)))
            # print((data2))

            output_c=data1.loc[data1['uqid'].isin(data2['uqid']) & data1['Company Code'].isin(data2['Company Code'])] 
            #output_c=output_c.drop(['Posting Date'],axis=1)
            output_c=output_c.drop_duplicates()

            #print(output_c.to_excel(a))


            output_d=data2.loc[data2['uqid'].isin(data1['uqid']) & data2['Company Code'].isin(data1['Company Code'])]
            # output_x=output_c.concat(output_d, axis=1)
            # output_c=output_c.drop_duplicates()
            #output_d=output_d.drop(['Posting Date'],axis=1)
            output_d=output_d.drop_duplicates()

    
        
        else:
            print ("No rows found in the selection criteria.")
        
        return output_c,output_d

    def mcsd2026_create_uniqueid(self,df_json):
        for item in df_json:
                # print(item)
                GL_Account = str(item['G/L Account'])
                created_by = str(item['User Name'])
                Customer= str(item['Customer'])
                combined_key = GL_Account + '_' + created_by + '_' + Customer
                item['uqid'] = combined_key
        return df_json
    
    def mcsd2026_checkdb(self, exception_Invoice, exception_Payment):
        
        username = urllib.parse.quote_plus('sapitsm01')
        password = urllib.parse.quote_plus('haihello123')

        exception_Payment=self.utils.convert_df_to_json(exception_Payment)
        exception_Invoice=self.utils.convert_df_to_json(exception_Invoice)

        # client = MongoClient("mongodb://sapitsm:haihello@123@20.204.119.18:27017")
        #client = MongoClient('mongodb://%s:%s@20.204.119.18:27017' % (username, password))
        client=MongoClient('mongodb+srv://Rohit:Bloodhound@sap.jecebdf.mongodb.net/<database_name>?retryWrites=true&w=majority')

        mydb = client["sapsample01"]

        mycol = mydb["mcsd2026"]
        
        final_exc_list_invoice = []
        final_exc_list_payment = []
        
        for item in exception_Invoice:
            combined_value = item['uqid']
            document_Number=item['Document Number']
            query = {'uqid': combined_value, 'Document Number':document_Number}
            document = mycol.find_one(query)
            if document:
                
                print("Entry is present in the Database")
                
                # Set the flag to send the JSON request
                send_request_in = False
                
            else:
                
                mycol.insert_one(item)
                print("Inserting in the Database...")
                final_exc_list_invoice.append(item)
                
                # Set the flag to send the JSON request
                send_request_in = True

        for item in exception_Payment:
            combined_value = item['uqid']
            document_Number=item['Document Number']
            query = {'uqid': combined_value, 'Document Number':document_Number}
            document = mycol.find_one(query)
            if document:
                
                print("Entry is present in the Database")
                
                # Set the flag to send the JSON request
                send_request_pay = False
                
            else:
                
                mycol.insert_one(item)
                print("Inserting in the Database...")
                final_exc_list_payment.append(item)
                
                # Set the flag to send the JSON request
                send_request_pay = True        
        # Send JSON request if the flag is True    #Changes made by Yashg
        # if send_request:
            
        #     self.l2_create_json_ticket(final_exception_list)    
        
        # client.close()
            if send_request_in:
            
                self.l2_create_json_ticket(final_exc_list_invoice)    
        
            if send_request_pay:
            
                self.l2_create_json_ticket(final_exc_list_payment)    
        
        client.close()
            
        return final_exc_list_invoice,final_exc_list_payment
    
    def l2_create_json_ticket(self, exception_data):
        
        # <----------------Attachement--------------------->        
        # create a .txt file to send as attachment
        df = pd.DataFrame(exception_data)
        file_name = 'sd2026_data.txt'        
        sd2026_result = df.to_string(index = False)        
        self.utils.write_to_a_txt(sd2026_result, file_name)
        # <----------------Attachement--------------------->
        
        # <--------- Generate ITSM header data ---------------------------->        
        # A module to send json tickets to ITSM and EKS    
        output_list = []           
        
        print("Creating JSON ticket - MC_SD_2026")     
        
        
        json_skeleton = self.utils.read_json_file('/home/lokkith/Documents/SAP/config/itsec001/itsec001_schema.json')            
        json_skeleton['MANDT'] = '1002'
        json_skeleton['RFC'] = '100'
        json_skeleton['REQ_NO'] = '1000000098'
        json_skeleton['ALERT_SEND_DATE'] = self.utils.current_date()
        json_skeleton['ALERT_SEND_TIME'] = '12:05:2023'
        json_skeleton['EVENT_ID'] = 'MC_SD_2026'
        json_skeleton['EVENT_DESCRIPTION'] = 'Maintain an invoice and enter or change payments against it.'
        json_skeleton['PROGRAM_NAME'] = 'ZMC_SD_2026'
        json_skeleton['SEVERITY'] = 'HIGH'
        json_skeleton['RISK_DESCRIPTION'] = 'The user who is processing the invoice/payment is posting the invoice/Payment for the same customer.'
        json_skeleton['EVENT_CLASS'] = 'MITIGATION CONTROL'
        json_skeleton['CATEGORIES'] = 'SOD VIOLATIONS'
        json_skeleton['RISK_OWNER'] = 'ETD_ALERT'
        json_skeleton['ALERT_CLOSED_DATE'] = ''
        json_skeleton['ALERT_STATUS'] = 'SUCCESS'
        json_skeleton['STATUS'] = 'OPEN'
        json_skeleton['INCIDENT_NO'] = '' 
                 
        output_list.append(json_skeleton)
        # <--------- Generate ITSM header data ---------------------------->
        
        # sending the data to the Server
        # self.utils.send_requests(output_list)
        
        # # sending the data to the Server
        self.utils.send_requests(output_list, file_name)     
        
        return