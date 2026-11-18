user_data = {
    "1001": {"username": "preetam", "password": "2006"},
    "1002": {"username": "aryan", "password": "1234"},
    "1003": {"username": "charitha", "password": "5678"},
    "1004": {"username": "adarsh", "password": "91011"},
}


user_id = input("Enter your ID: ")
username = input("Enter your username: ")
password = input("Enter your password: ")

user = user_data.get(user_id)
if user is None:
    print("Invalid ID")
elif user["username"] != username:
    print("Invalid username")
elif user["password"] != password:
    print("Invalid password")
else:
    print("Login successful")
