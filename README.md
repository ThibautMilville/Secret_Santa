
<h1>Secret Santa Web App</h1>
Welcome to the Secret Santa Web App! This application allows you to organize a Secret Santa gift exchange with your friends or colleagues. Participants draw names randomly, ensuring a surprise element to the gift-giving tradition.<br><br>

![image](https://github.com/ThibautMilville/Secret_Santa/assets/87717065/b28d0293-8c88-4613-9cad-b29276abdd88)

Launch the app here : https://secret-santa-thibaut-milville.vercel.app/

<h2>Getting Started</h2>
To run the app locally, follow these steps:

1) Clone the repository:
```bash
git clone https://github.com/thibaut-milville/secret-santa.git
cd secret-santa
```

2) Install dependencies:<br>
```bash
pip install -r requirements.txt
```

3) Configure the environment variables:<br><br>
To enable the email functionality, set the SENDGRID_API_KEY environment variable. On a local environment, use the following command:

```bash
setx SENDGRID_API_KEY "your_api_key_here"
```
Additionally, configure the sender email in the "constants" file located in the "config" folder.<br><br>
4) Run the Flask app:
```bash
flask run
```
Visit http://localhost:5000 to access the Secret Santa Web App.

<h2>Deployment</h2>
You can deploy this app to Vercel or any other hosting service of your choice. Ensure to set the environment variables, especially the SENDGRID_API_KEY, on your hosting platform.

<h2>Features</h2>
Randomized Pairing: Participants are randomly paired with each other, ensuring the secrecy of the gift exchange.<br>
Email Notifications: The app sends email notifications to participants, providing details about their assigned gift recipient.<br>
Configurability: Easily configure the sender email and other parameters in the "constants" file.<br>
<h2>Technologies Used</h2>
HTML5: Front-end structure and layout.<br>
SCSS: Styling and design.<br>
JavaScript: Client-side interactivity.<br>
Python: Server-side logic.<br>
Flask: Web framework for Python.<br>
h2><Contribution Guidelines</h2>
Feel free to contribute to this project by submitting issues or pull requests. Follow the established coding style and make sure to thoroughly test your changes.

<h2>License</h2>
This project is licensed under the MIT License.

Thank you for using the Secret Santa Web App! If you encounter any issues or have suggestions for improvement, please don't hesitate to open an issue. Happy gifting! 🎁
