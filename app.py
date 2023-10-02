import os
from flask import Flask, render_template, request
import random
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)

participants = []
message = ""
assignments = []

# Route to the index page
@app.route("/", methods=["GET", "POST"])
def index():
    global participants, message, assignments

    if request.method == 'POST':
        data = request.get_json()

        if "participants" in data and "message" in data:
            participants = data["participants"]

            user_message = data["message"]
            assignments = secret_santa(participants)

            send_emails(assignments, user_message)
            
    return render_template("index.html")

def secret_santa(participants):
    # Check if every giver has a different receiver
    while True:
        assignments = assign_gifts(participants)
        valid = all(giver != receiver for giver, receiver in assignments)
        if valid:
            return assignments

def assign_gifts(participants):
    giver_list = participants.copy()
    receiver_list = participants.copy()
    assignment_list = []

    for giver in giver_list:
        while True:
            # Choose a random receiver and check if it is not the same as the giver
            receiver = random.choice(receiver_list)
            if giver != receiver:
                break
            elif len(receiver_list) == 1:
                # If there is only one participant left and it is the same as the giver, we start again
                receiver_list = participants.copy()
        # Add the gift assignment to the list
        assignment_list.append({"giver": giver, "receiver": receiver})
        receiver_list.remove(receiver)
    
    return assignment_list

# Send an email to every giver
def send_emails(assignments, user_message):
    for assignment in assignments:
        giver = assignment["giver"]
        receiver = assignment["receiver"]
        send_email(giver, receiver, user_message)

def send_email(giver, receiver, user_message):
    try:
        # Get the main participant (the initiator of the Secret Santa)
        main_participant_name = participants[0]["name"]

        giver_name = giver['name']
        giver_email = giver['email']
        receiver_name = receiver['name']

        api_key = os.environ.get('SENDGRID_API_KEY')

        if api_key:
            # Initialize the SendGrid client
            sg = SendGridAPIClient(api_key)
            print("API key found", api_key)
        else:
            print("No API key found", api_key)
            return

        subject = f"Secret Santa - Your receiver is {receiver_name}"
        content = f'Hello {giver_name},\n\nYou participate to the Secret Santa organised by {main_participant_name}. Your receiver is {receiver_name}!\n\n{main_participant_name} has a message for you! Here it is:\n"{user_message}"\n\nMerry Christmas!'
        
        message = Mail(
            from_email='tmilville.pro@gmail.com',
            to_emails=giver_email,
            subject=subject,
            plain_text_content=content
        )
        
        response = sg.send(message)

        if response.status_code == 202:
            print(f"Email sent to {receiver_name}!")
        else:
            print(f"Failed to send email. Status code: {response.status_code}")
            print(response.body)
    except Exception as e:
        print(f"Error while sending email to receiver {receiver_name}: {e}")
        print()

# Run the app in local
if __name__ == "__main__":
    app.run(debug=True)