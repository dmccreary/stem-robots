prompt = """
Create a python program that has three required parameters, 
a persona, a topic and a grade level.  The program will 
look for parameters "p" for persona, "t" for topic and "g" for grade level.
If the parameters are not specified on the command line, 
the program will give the user a sample list and ask for the value.  
The personas are "teacher", "student" or "admin", the topics are "motors", 
"microcontrollers", "python" or "sensors" and the grades levels are 1 to 12.
"""

import argparse

def get_user_input(option_type, options):
    while True:
        print(f"Please select a {option_type} from the following list:")
        for option in options:
            print(option)
        user_input = input(f"Enter your {option_type}: ").lower()
        if user_input in options:
            return user_input
        else:
            print(f"Invalid {option_type}. Please try again.")

def main(persona, topic, grade_level):
    personas = ['teacher', 'student', 'admin']
    topics = ['motors', 'microcontrollers', 'python', 'sensors']
    grades = [str(i) for i in range(1, 13)]

    if persona not in personas:
        persona = get_user_input("persona", personas)
    if topic not in topics:
        topic = get_user_input("topic", topics)
    if grade_level not in grades:
        grade_level = get_user_input("grade level", grades)

    print(f"Generating lesson plan for Persona: {persona}, Topic: {topic}, Grade Level: {grade_level}")
    # 
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process the persona, topic, and grade level.")
    parser.add_argument("-p", "--persona", type=str, help="Specify the persona (teacher, student, admin)")
    parser.add_argument("-t", "--topic", type=str, help="Specify the topic (motors, microcontrollers, python, sensors)")
    parser.add_argument("-g", "--grade", type=str, help="Specify the grade level (1-12)")

    args = parser.parse_args()

    # Pass arguments to main function, default to None if not specified
    main(persona=args.persona, topic=args.topic, grade_level=args.grade)

