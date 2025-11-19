#!/bin/bash
# MongoDB Migration Script - Local to MongoDB Atlas
# This script helps backup and restore data between MongoDB instances

echo "🔄 MongoDB Migration Tool"
echo "=========================="
echo ""
echo "This script helps migrate data from local MongoDB to MongoDB Atlas"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
    echo -e "${RED}❌ mongodump not found${NC}"
    echo "Please install MongoDB Database Tools:"
    echo "Visit: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

if ! command -v mongorestore &> /dev/null; then
    echo -e "${RED}❌ mongorestore not found${NC}"
    echo "Please install MongoDB Database Tools:"
    echo "Visit: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

echo -e "${BLUE}Step 1: Backup Local MongoDB${NC}"
echo "=============================="
read -p "Enter local MongoDB URI (default: mongodb://localhost:27017): " LOCAL_URI
LOCAL_URI=${LOCAL_URI:-mongodb://localhost:27017}

read -p "Enter database name to backup (default: resume-builder): " DB_NAME
DB_NAME=${DB_NAME:-resume-builder}

BACKUP_DIR="./mongodb_backup_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}⏳ Backing up database...${NC}"
mongodump --uri="$LOCAL_URI/$DB_NAME" --out="$BACKUP_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup successful!${NC}"
    echo "Backup location: $BACKUP_DIR"
else
    echo -e "${RED}❌ Backup failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Restore to MongoDB Atlas${NC}"
echo "=================================="
read -p "Enter MongoDB Atlas connection string: " ATLAS_URI

# Ensure connection string has database name
if [[ ! "$ATLAS_URI" == *"$DB_NAME"* ]]; then
    ATLAS_URI="${ATLAS_URI}/${DB_NAME}"
fi

echo -e "${YELLOW}⏳ Restoring to MongoDB Atlas...${NC}"
mongorestore --uri="$ATLAS_URI" "$BACKUP_DIR/$DB_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Restoration successful!${NC}"
    echo ""
    echo -e "${BLUE}Migration Summary:${NC}"
    echo "  Source: $LOCAL_URI/$DB_NAME"
    echo "  Target: MongoDB Atlas"
    echo "  Backup: $BACKUP_DIR"
    echo ""
    echo -e "${YELLOW}⚠️  Important:${NC}"
    echo "  1. Verify data in MongoDB Atlas dashboard"
    echo "  2. Update .env file with Atlas connection string"
    echo "  3. Test application with new database"
    echo "  4. Keep backup until you confirm everything works"
else
    echo -e "${RED}❌ Restoration failed!${NC}"
    echo "Backup preserved at: $BACKUP_DIR"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Migration complete!${NC}"
