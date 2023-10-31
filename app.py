from __future__ import division, print_function
# coding=utf-8
import sys
import os
import glob
import re
import numpy as np
import string
import tensorflow as tf

tf.keras.backend.clear_session()


#for database connection
from mysql.connector import cursor
from connection import conn

cursor = conn.cursor()

#for password encryption
import bcrypt
from functions import *

# Keras
from keras.applications.imagenet_utils import preprocess_input, decode_predictions
from keras.models import load_model
from keras.preprocessing import image

from keras.optimizers import Adam
from keras.losses import categorical_crossentropy

# Flask utils
from flask import Flask, redirect, url_for, request, render_template, jsonify, session #flask module used for deployment of ml model on web server
from werkzeug.utils import secure_filename
from gevent.pywsgi import WSGIServer

# Define a flask app
app = Flask(__name__)

# Model saved with Keras model.save()
MODEL_PATH = 'model.keras'
model = load_model(MODEL_PATH)
model.make_predict_function()
print('Model loaded. Start serving...')

'''model.compile(optimizer=Adam(learning_rate=0.001), loss=categorical_crossentropy, metrics=['accuracy'])'''

# You can also use pretrained model from Keras
# Check https://keras.io/applications/
'''from keras.applications.resnet50 import ResNet50
model = ResNet50(weights='imagenet')
model.save('./model.keras')'''
print('Model loaded. Check http://127.0.0.1:5000/')


def model_predict(img_path, model):
    img = image.load_img(img_path, target_size=(224, 224))

    # Preprocessing the image
    x = image.img_to_array(img)
    # x = np.true_divide(x, 255)
    x = np.expand_dims(x, axis=0)

    # Be careful how your trained model deals with the input
    # otherwise, it won't make correct prediction!
    x = preprocess_input(x, mode='caffe') #data can be currupted. so image preprocessig method.

    preds = model.predict(x)
    return preds


@app.route('/', methods=['GET'])
def landing():
    return render_template('landing.html') #used for loading html pages in python


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        user_id = random_num(20)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        query = "INSERT INTO user_data (user_id, email, username, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (user_id, email, username, hashed_password))
        conn.commit()

        response = {'message': 'Registration successful'}
        return jsonify(response) #used to convert response into json format


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        email = request.form['email']
        input_password = request.form['password']

        query = "SELECT * FROM user_data WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()

        if result:
            stored_hashed_password = result[-1].encode('utf-8')
            if bcrypt.checkpw(input_password.encode('utf-8'), stored_hashed_password):
                session['user_id'] = result[1]
                response = {'message': 'Login successful'}
                return jsonify(response)
            else:
                response = {'message': 'Invalid password'}
                return jsonify(response)
        else:
            response = {'message': 'User does not exist'}
            return jsonify(response)


@app.route('/logout')
def logout():
    if check_login(conn):
        session.pop('user_id', None)
        return redirect(url_for('login'))


@app.route('/index', methods=['GET'])
def index():
    #Main Page
    if check_login(conn):
        return render_template('index.html')
    else:
        return redirect(url_for('login'))


@app.route('/predict', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        # Get the file from post request
        f = request.files['file']

        # Save the file to ./uploads
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(basepath, 'uploads', secure_filename(f.filename))
        f.save(file_path)

        # Make prediction
        preds = model_predict(file_path, model)

        # Process your result for human
        # pred_class = preds.argmax(axis=-1)            # Simple argmax
        pred_class = decode_predictions(preds, top=1)   # ImageNet Decode
        result = str(pred_class[0][0][1])               # Convert to string
        return result
    return None

#for secret key


import binascii


if __name__ == '__main__':
    secret_key = binascii.hexlify(os.urandom(24)).decode()
    app.secret_key = secret_key
    http_server = WSGIServer(('0.0.0.0', 5000), app)
    http_server.serve_forever()