module.exports={
    mongoURI : 'mongodb+srv://'+process.env.DB_USER_PASS+'@cluster0.ewcff.mongodb.net/'+process.env.MY_FIRST_DB+'?retryWrites=true&w=majority',
    mongotestURI :'mongodb+srv://'+process.env.DB_USER_PASS+'@cluster0.ewcff.mongodb.net/'+process.env.MY_TEST_DB+'?retryWrites=true&w=majority'
}
