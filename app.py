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

            # Get the main participant (the initiator of the Secret Santa)
            main_participant_name = participants[0]["name"]
            main_participant_email = participants[0]["email"]

            user_message = data["message"]
            assignments = secret_santa(participants)

            send_emails(assignments, user_message)
            
    return render_template("index.html")

def secret_santa(participants):
    shuffled_participants = participants.copy()
    random.shuffle(shuffled_participants)
    
    global assignments
    possible_receivers = shuffled_participants.copy()

    for giver in shuffled_participants:
        # Check if the possible receivers list is empty
        if not possible_receivers:
            raise ValueError("Impossible to assign a receiver to a giver")
        
        possible_receivers.remove(giver)
        receiver = random.choice(possible_receivers)

        assignments.append({
            "giver": giver,
            "receiver": receiver
        })
    
    return assignments

def send_emails(assignments, user_message):
    for assignment in assignments:
        giver = assignment["giver"]
        receiver = assignment["receiver"]
        send_email(giver, receiver, user_message)

def send_email(giver, receiver, user_message):
    try:
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
        content = f"Hello {giver_name},\n\nYour receiver is {receiver_name}.\n\n{user_message}\n\nMerry Christmas !"
        
        message = Mail(
            from_email='tmilville.pro@gmail.com',
            to_emails="tmilville.pro@gmail.com",
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