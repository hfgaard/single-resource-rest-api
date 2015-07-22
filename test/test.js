'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
var mongoose = require('mongoose');
var app = require(__dirname + '/../server');
var User = require(__dirname + '/../models/user-model');

process.env.MONGOLAB_URL = 'mongodb://localhost/user_testdb';

chai.use(chaiHttp);

describe('server.js', function() {
  it('should create a new user', function(done) {
    chai.request('localhost:3000')
        .post('/api/user')
        .send({userName: 'test', email: 'a@a.com', password: 'password'})
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(typeof res.body).to.eql('object');
          expect(res.body.userName).to.eql('test');
          done();
        });
  });

  it('should get an array of the users', function(done) {
    chai.request('localhost:3000')
        .get('/api/users')
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(Array.isArray(res.body)).to.eql.true;
          done();
        });
  });

  describe('routes that need an existing user', function() {
    var userTest;
    before(function(done) {
      userTest = new User({userName: 'tester', email: 'b@b.com', password: 'password2'});
      userTest.save(function(err, data) {
        if (err) throw err;
        userTest = data;
        done();
      });
    });

    it('should be able to update', function(done) {
      chai.request('localhost:3000')
          .put('/api/user/' + userTest._id)
          .send({userName: 'tester', email: 'b@b.com', password: 'newpassword'})
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.body.msg).to.eql('User has been updated');
            done();
          });
    });

    it('should be able to delete a user', function(done) {
      chai.request('localhost:3000')
          .del('/api/user/' + userTest._id)
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res.body.msg).to.eql('User has been removed');
            done();
          });
    });
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
});
