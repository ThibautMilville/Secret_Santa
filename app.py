from functions.assignments import assign_secret_santa
from functions.send_emails import send_emails
from flask import Flask, request, jsonify, render_template

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
    if request.method == "POST":
        data = request.get_json()

        if "participants" in data and "blacklist" in data and "message" in data:
            # Get the data from the form
            participants = data["participants"]
            blacklists = data["blacklist"]
            user_message = data["message"]

            # Assign a receiver to every giver
            assignments = assign_secret_santa(participants, blacklists)

            if send_emails(participants, assignments, user_message):
                return jsonify({"response": "Emails sent successfully"})
            else:
                return jsonify({"response": "Failed to send emails"})
        else:
            return jsonify({"response": "Invalid data"})

    # If the request is a GET request, we return the index page
    else:
        return render_template("index.html")

# Run the app in local
if __name__ == "__main__":
    app.run(debug=True)