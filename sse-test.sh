BASE_URL="https://levelyn-api.p-e.kr/api"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInNhbHQiOiJzZmV3dmVydmVyb3B2bXZvcHJwZiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxMDAwMDAwMDAwMDAwMDAwMDAwMDB9.y59SON9bFNJjz52x5z42YQfVoM__XXpcsrgml9iLBuU"

curl -v -X PUT "$BASE_URL/to-do/291?token=$TOKEN"
curl -v "$BASE_URL/notifications/?token=$TOKEN"
