dir={
    0:{"username":"aryan","password":"123"},
    1:{"username":"shetty","password":"345"},
    2:{"username":"adarsh","password":"321"},
    3:{"username":"charitha","password":"012"}
}
print(dir[0])

def login(request):
    response={}
    usn=request.get("username")
    pd=request.get("password")
    c=dir.keys()
    for i in c:
        dic=dir[i]
        if usn == dic["username"] and pd == dic["password"]:
            response["status"]="success"
            response["message"]="login success"
            response["sessontoken"]="jsdbfuwuhfidwuf"
            break
        elif usn == dic["username"] and pd != dic["password"]:
            response["status"]="error"
            response["message"]="invalid password"
            response["sessontoken"]="jsdbfuwuhfidwuf"
            break
        elif usn != dic["username"] and pd == dic["password"]:
            response["status"]="error"
            response["message"]="invalid username"
            response["sessontoken"]="jsdbfuwuhfidwuf"
            break
    else:
        response["status"]="error"
        response["message"]="invalid username"
        response["sessontoken"]="jsdbfuwuhfidwuf"
    return response

print(login({"username":"aryan","password":"123"}))