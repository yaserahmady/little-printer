#!/usr/bin/env python3
# convert image.jpg -crop x768+0+0 result.jpg
# for file in *.png; do convert $file -crop x340+0+0 "`basename $file .png`-c.png"; done

import json

import inflection
import requests

endpoint = "http://casper.littleprinter.club:2222/api/render"
options = "&output=screenshot&viewport.width=384&screenshot.selector=%23scontrino"
publications = [
	{
		"name": "Who's that Pokéfusion?",
		"author": "Yaser Ahmady",
		"screenshot_url": f"{endpoint}?url=https://pedantic-gates-e992e2.netlify.app/{options}",
		"url": "https://pedantic-gates-e992e2.netlify.app/",
	},
	{
		"name": "How many people are in space right now?",
		"author": "Yaser Ahmady",
		"screenshot_url": "https://www.littleprinter.club/publications/36",
		"url": "https://www.littleprinter.club/publications/36",
	},
	{
		"name": "Maze-a-Day",
		"author": "Yaser Ahmady",
		"screenshot_url": "https://www.littleprinter.club/publications/69",
		"url": "https://www.littleprinter.club/publications/69",
	},
	{
		"name": "Astronomy Picture of the Day",
		"author": "Yaser Ahmady",
		"screenshot_url": "https://www.littleprinter.club/publications/311",
		"url": "https://www.littleprinter.club/publications/311",
	},
	{
		"name": "Numero di telefono random",
		"author": "Aurora Carrà",
		"screenshot_url": f"{endpoint}?url=https://phone-number-random.netlify.app/{options}",
		"url": "https://phone-number-random.netlify.app/",
	},
	{
		"name": "Computer random",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://computer-of-the-day.netlify.app/{options}",
		"url": "https://computer-of-the-day.netlify.app/",
	},
	{
		"name": "Caffe del giorno",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://coffee-of-the-day.netlify.app/{options}",
		"url": "https://coffee-of-the-day.netlify.app/",
	},
	{
		"name": "Birra random",
		"author": "Aurora Carrà",
		"screenshot_url": f"{endpoint}?url=https://randombeer.netlify.app/{options}",
		"url": "https://randombeer.netlify.app/",
	},
	{
		"name": "Cannabis random",
		"author": "Aurora Carrà",
		"screenshot_url": f"{endpoint}?url=https://cannabisrandom.netlify.app/{options}",
		"url": "https://cannabisrandom.netlify.app/",
	},
	{
		"name": "Piatto del giorno",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://meal-of-the-day.netlify.app/{options}",
		"url": "https://meal-of-the-day.netlify.app/",
	},
	{
		"name": "Valore Bitcoin",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://valore-bitcoin.netlify.app/{options}",
		"url": "https://valore-bitcoin.netlify.app/",
	},
	{
		"name": "Baci perugina",
		"author": "Luca Aggio",
		"screenshot_url": f"{endpoint}?url=https://friendly-kirch-1b2ae4.netlify.app/{options}",
		"url": "https://friendly-kirch-1b2ae4.netlify.app/",
	},
	{
		"name": "Attività Random",
		"author": "Aurora Carrà",
		"screenshot_url": f"{endpoint}?url=https://random-activity.netlify.app//{options}",
		"url": "https://random-activity.netlify.app/",
	},
	{
		"name": "Cosa farai oggi?",
		"author": "Lavinia Garau",
		"screenshot_url": f"{endpoint}?url=https://what-do-you-do.netlify.app/{options}",
		"url": "https://what-do-you-do.netlify.app",
	},
	{
		"name": "Dessert Random",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://dessert-random.netlify.app/{options}",
		"url": "https://dessert-random.netlify.app/",
	},
	{
		"name": "Joke Random",
		"author": "Aurora Carrà",
		"screenshot_url": f"{endpoint}?url=https://joke-random.netlify.app//{options}",
		"url": "https://joke-random.netlify.app/",
	},
	{
		"name": "SuperHero Random Picker",
		"author": "Giuseppe Conti",
		"screenshot_url": f"{endpoint}?url=https://random-superhero-picker.netlify.app/{options}",
		"url": "https://random-superhero-picker.netlify.app/",
	},
	{
		"name": "Random Dog",
		"author": "Sara Fossati",
		"screenshot_url": f"{endpoint}?url=https://dog-random.netlify.app/{options}",
		"url": "https://dog-random.netlify.app/",
	},
]


def main():
	for p in publications:
		download(p["screenshot_url"], p["name"])
		filename = inflection.underscore(p["name"]).replace(" ", "_").replace("?", "")
		p["preview"] = f"previews/{filename}.png"

	with open("publications.json", "w") as outfile:
		json.dump(publications, outfile)


def download(url, name):
	filename = inflection.underscore(name).replace(" ", "_").replace("?", "").strip("'")
	print(f"Downloading {filename}")

	response = requests.get(url)

	with open(f"previews/{filename}.png", "wb") as file:
		file.write(response.content)


if __name__ == "__main__":
	main()
