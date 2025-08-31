#!/bin/bash
# === Configuration ===
DB_NAME="college"
DB_USER="root"
DB_PASS="root"
PM2_APP_NAME="college-system"
APP_ENTRY="/college-system/app.js" 

# === Install MySQL and utilities ===
echo "📦 Installing MySQL..."
sudo apt update
sudo apt install mysql-server ufw curl -y

# === Start & Enable MySQL ===
echo "🚀 Starting and enabling MySQL..."
sudo systemctl start mysql
sudo systemctl enable mysql

# === Basic Security (non-interactive) ===
echo "🔐 Securing MySQL..."
sudo mysql <<EOF
DELETE FROM mysql.user WHERE User='';
DROP DATABASE IF EXISTS test;
DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';
FLUSH PRIVILEGES;
EOF

# === Create DB and Remote Access for root ===
echo "🛠️ Creating MySQL database and remote access for root..."
sudo mysql <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
FLUSH PRIVILEGES;
EOF

# === Enable Remote Connections ===
echo "🌐 Configuring MySQL to allow remote connections..."
sudo sed -i "s/^bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql

# === Allow MySQL through Firewall ===
echo "🧱 Allowing port 3306 through firewall..."
sudo ufw allow 3306
sudo ufw allow OpenSSH
sudo ufw --force enable

# === Start or Restart PM2 App ===
echo "🚀 Starting your Express app with PM2..."
pm2 delete "$PM2_APP_NAME" 2>/dev/null
pm2 start "$APP_ENTRY" --name "$PM2_APP_NAME"
pm2 save

# === Done ===
IP_ADDR=$(curl -s ifconfig.me)
echo "✅ Setup complete!"
echo "🌍 You can connect to MySQL remotely using:"
echo "    Host: $IP_ADDR"
echo "    User: $DB_USER"
echo "    Password: $DB_PASS"
echo "    Database: $DB_NAME"
echo "📦 Ensure your client allows connections to port 3306."