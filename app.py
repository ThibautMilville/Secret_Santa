from flask import Flask, render_template, request
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

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
            message = data["message"]
            assignments = secret_santa(participants)

            # Send emails to all participants
            for assignment in assignments:
                giver = assignment["giver"]
                receiver = assignment["receiver"]
                send_email(giver, receiver, message)
            
    return render_template("index.html")

def secret_santa(participants):
    shuffled_participants = participants.copy()
    random.shuffle(shuffled_participants)
    
    global assignments
    for i in range(len(participants)):
        giver = participants[i]
        receiver = None

        # Assign a receiver to the giver | Cannot be the same person
        while receiver is None or receiver == giver:
            receiver = random.choice(participants)

        assignments.append({
            "giver": giver,
            "receiver": receiver
        })
    
    return assignments

def send_email(giver, receiver, message):
    # Configuration for the SMTP server
    smtp_server = 'smtp.example.com'
    smtp_port = 587
    smtp_username = 'votre_adresse_email@example.com'
    smtp_password = 'votre_mot_de_passe'

    # Creation of the message
    msg = MIMEMultipart()
    msg['From'] = smtp_username
    msg['To'] = giver  # Receiver's email address
    msg['Subject'] = 'Père Noël Secret'

    # Body of the message
    body = f'Bonjour {giver},\n\nVous devez offrir un cadeau à {receiver}.\n\n{message}'
    msg.attach(MIMEText(body, 'plain'))

    # Connection to the SMTP server and sending of the message
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, giver, text)
        server.quit()
        print(f"E-mail envoyé à {giver} avec le nom de {receiver}")
    except Exception as e:
        print(f"Erreur lors de l'envoi de l'e-mail à {giver}: {str(e)}")

# Run the app in local
if __name__ == "__main__":
    app.run(debug=True)