import base64

# Change the path to your actual MP3 file
mp3_path = "C:/Users/Admin/Desktop/chatbot/sophia_web_app/hello1.mp3"
output_path = "C:/Users/Admin/Desktop/chatbot/sophia_web_app/hello1_base64.txt"

# Read the MP3 and encode it to Base64
with open(mp3_path, "rb") as f:
    b64_audio = base64.b64encode(f.read()).decode("utf-8")

# Save the Base64 string to a text file
with open(output_path, "w") as out_file:
    out_file.write(b64_audio)

print(f"Base64 audio saved to: {output_path}")

