#include <DHT.h> //you need to import the zip which is in the same folder of this sketch

String temp; //temperature
String hum;  //humiduty

#define DHTPIN 7
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup()
{
	Serial.begin(9600);
	delay(1000);
}

void loop()
{
	temp = String(dht.readTemperature());
	hum = String(dht.readHumidity());
	Serial.print("{\"temp\": ");
	Serial.print(temp);
	Serial.print(", \"hum\": ");
	Serial.print(hum);
	Serial.print(", \"id\": 0");
	Serial.print("}");
	Serial.println();
	delay(30000);
}
