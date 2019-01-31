import serial
import paho.mqtt.client as mqtt
import ssl
import time


def connected(client, userdata, flags, rc):
    print("Connesso al broker")


# Creo il client MQTT, imposto l'utente e TLS e mi connetto
client = mqtt.Client("arduino")
client.username_pw_set("arduino", password="esamequinta")
client.tls_set_context(ssl.create_default_context())
client.connect("mqtt.acerbisgianluca.com", port=8883)
client.on_connect = connected
client.loop_start()

# Creo l'oggetto serial impostando la porta USB e i baud
ser = serial.Serial('/dev/ttyACM0', 9600)
while True:
    if(ser.in_waiting > 0):
        line = ser.readline().decode("utf-8").rstrip()
        if("NAN" not in line and line.startswith("{\"")):
            client.publish("arduinodata", line)
            print(line)
