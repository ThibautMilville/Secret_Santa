import random
import logging

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
                if giver["name"] == receiver["name"]:
                    return False
                else:
                    # Check if the blacklist is respected
                    for blacklist in blacklists:
                        if (
                            receiver["name"] == blacklist["receiver"]
                            and giver["name"] in blacklist["giver"]
                        ):
                            return False
                return True

            random.shuffle(receiver_list)

            for receiver in receiver_list:
                if receiver != giver and is_valid_assignment(
                    giver, receiver, blacklists
                ):
                    logging.info(f"{giver['name']} -> {receiver['name']}")
                    return {"giver": giver, "receiver": receiver}

            logging.warning(
                f"Impossible to find a valid receiver for {giver['name']} within the constraints."
            )
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