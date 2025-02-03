# Use an official Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy your project files into the Nginx HTML directory
COPY parallaxhtml.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY blob.png /usr/share/nginx/html/blob.png
COPY dolphin.png /usr/share/nginx/html/dolphin.png
COPY fisherman-unscreen.gif /usr/share/nginx/html/fisherman-unscreen.gif
COPY turtlegif.gif /usr/share/nginx/html/turtlegif.gif
COPY octo2anim-unscreen.gif /usr/share/nginx/html/octo2anim-unscreen.gif
COPY midocean.jpg /usr/share/nginx/html/midocean.jpg
COPY oceantop.jpg /usr/share/nginx/html/oceantop.jpg

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
