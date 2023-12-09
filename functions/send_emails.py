import os
from config.constants import SENDER_EMAIL
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Send an email to every giver
def send_emails(participants, assignments, user_message):
    def send_email(giver, receiver, user_message):
        try:
            giver_name = giver["name"]
            giver_email = giver["email"]
            receiver_name = receiver["name"]

            api_key = os.environ.get("SENDGRID_API_KEY")

            if api_key:
                # Initialize the SendGrid client
                sg = SendGridAPIClient(api_key)
                print("API key found", api_key)
            else:
                print("No API key found", api_key)
                return

            if giver == main_participant:
                # Customized email for the main participant who is also a giver
                subject = "Secret Santa - Your little elves gave the information!"
                content = f"Hello {giver_name},\n\nYou are the main participant and giver of {receiver_name} in the Secret Santa event you organized. Here is the list of all participants:\n"

                # Add the names of all participants to the content string
                for participant in participants:
                    content += f"- {participant['name']} - {participant['email']}\n"

                content += f"\nYou are the secret santa of {receiver_name} and the emails have been sent to all of your friends. Enjoy the holiday season!\n\nMerry Christmas!"

            else:
                subject = f"Secret Santa - Your receiver is {receiver_name}"
                content = f'Hello {giver_name},\n\nYou participate to the Secret Santa organised by {main_participant["name"]}. Your receiver is {receiver_name}!\n\n{main_participant["name"]} has a message for you! Here it is:\n"{user_message}"\n\nMerry Christmas!'

            message = Mail(
                from_email=SENDER_EMAIL,
                to_emails=giver_email,
                subject=subject,
                plain_text_content=content,
            )

            response = sg.send(message)

            if response.status_code == 202:
                print(f"Email sent to {giver_name} for {receiver_name}")
            else:
                print(f"Failed to send email. Status code: {response.status_code}")
                print(response.body)
        except Exception as e:
            print(f"Error while sending email to receiver {giver_name}: {e}")

    # Get the main participant (the initiator of the Secret Santa)
    main_participant = participants[0]

    for assignment in assignments:
        giver = assignment["giver"]
        receiver = assignment["receiver"]
        send_email(giver, receiver, user_message)
    return True