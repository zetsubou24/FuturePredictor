
import os

name='PAULA-Backend-tools'
version='0.9_b0'
description='Prerequisite Tools for running the backend'
author='Taran Rishit and Akhil A M'
author_email='taranrishit1234@gmail.com,alphabetaomega4@gmail.com'
url='https://github.com/zetsubou24/FuturePredictor/tree/iterator'
packagesBackend=['json','sklearn','scipy','pickle','argparse','flask','flask_cors','numpy','pandas','matplotlib','colorsys','folium']

for pkg in packagesBackend:
    try:
        os.system("pip install "+pkg)
    except:
        print("The Requirement might have already been installed or must be installed seperately.")
        