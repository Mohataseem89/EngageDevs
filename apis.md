# engagedev APIs

## authrouter
- POST /signup
- POST /login
- POST /logout


## profileRouter
- GET /profile/view
- PATCH /profile/edit
- Patch /profile/delete
- GET /profile/followers
- GET /profile/following
- GET /profile/posts
- GET /profile/likes
- GET /profile/comments
- GET /profile/notifications
- PATCH /profile/password
- PATCH /profile/username
- PATCH /profile/email



Status: ignore, interested, accepted, rejected

## connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId  


## userRouter
- GET /user/connections
- GET /user/requests/received
- GET /user/feed
- GET /user/posts

