from flask import Flask, render_template, request

app = Flask(__name__)

participants = [] # List of all participants

# Route to the index page
@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        participant_name = request.form['participantName']
        # Recuperate the name of the participant from the form

        # Add the name of the participant to the list
        participants.append(participant_name)

    return render_template('index.html', participants=participants)

# Run the app

if __name__ == '__main__':
    app.run(debug=True)