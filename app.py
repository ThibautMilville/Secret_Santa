from flask import Flask, render_template, request

app = Flask(__name__)

participants = []  # List of all participants
message = None


# Route to the index page
@app.route("/", methods=["GET", "POST"])
def index():
    global participants, message

    if request.method == 'POST':

        data = request.get_json()

        if "participants" in data and "message" in data:
            participants = data["participants"]
            message = data["message"]

    return render_template("index.html")

# Run the app in local
if __name__ == "__main__":
    app.run(debug=True)