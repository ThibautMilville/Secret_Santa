import os
from flask import Flask, request, jsonify, render_template
import random
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)

participants = []
blacklist = []
message = ""
assignments = []

# Route to the index page
@app.route("/", methods=["GET", "POST"])

def index():
    # We create global variables to be able to use them in the other functions
    global participants, message, assignments

    # If the request is a POST request, we get the data from the form
    if request.method == 'POST':
        data = request.get_json()

        if "participants" in data and "blacklist" in data and "message" in data:
            # Get the data from the form
            participants = data["participants"]
            blacklists = data["blacklist"]
            user_message = data["message"]

            # Assign a receiver to every giver
            assignments = assign_secret_santa(participants, blacklists)

            if(send_emails(assignments, user_message)):
                return jsonify({"response": "Emails sent successfully"})
            else:
                return jsonify({"response": "Failed to send emails"})
        else:
            return jsonify({"response": "Invalid data"})
        
    # If the request is a GET request, we return the index page
    else:
        return render_template("index.html")

# Assign a receiver to every giver
def assign_secret_santa(participants, blacklists):

    # Assign a receiver to every giver
    def generate_gift_assignments(participants, blacklists):
        logging.basicConfig(level=logging.INFO)

        # Generate a random assignment for a giver
        def generate_assignment(giver, receiver_list):

            # Check if the assignment is valid
            def is_valid_assignment(giver, receiver, blacklists):
                # Check if the giver and the receiver are not the same
                if (giver["name"] == receiver["name"]):
                    return False
                else:
                    # Check if the blacklist is respected
                    for blacklist in blacklists:
                        if receiver["name"] == blacklist["receiver"] and giver["name"] in blacklist["giver"]:
                            return False
                return True
        
            random.shuffle(receiver_list)

            for receiver in receiver_list:
                if receiver != giver and is_valid_assignment(giver, receiver, blacklists):
                    logging.info(f"{giver['name']} -> {receiver['name']}")
                    return {"giver": giver, "receiver": receiver}

            logging.warning(f"Impossible to find a valid receiver for {giver['name']} within the constraints.")
            return None

        giver_list = participants.copy()
        receiver_list = participants.copy()
        assignment_list = []

        for giver in giver_list:
            assignment = generate_assignment(giver, receiver_list)
            
            if assignment:
                assignment_list.append(assignment)
                receiver_list.remove(assignment["receiver"])

        return assignment_list

    # Assign and check if every giver has a different receiver
    while True:
        assignments = generate_gift_assignments(participants, blacklists)
        valid = all(giver != receiver for giver, receiver in assignments)
        if valid:
            return assignments

# Send an email to every giver
def send_emails(assignments, user_message):

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
                print(f"Email sent to {giver_name} for {receiver_name}")
            else:
                print(f"Failed to send email. Status code: {response.status_code}")
                print(response.body)
        except Exception as e:
            print(f"Error while sending email to receiver {giver_name}: {e}")

    for assignment in assignments:
        giver = assignment["giver"]
        receiver = assignment["receiver"]
        send_email(giver, receiver, user_message)
    return True

# Run the app in local
if __name__ == "__main__":
    app.run(debug=True)