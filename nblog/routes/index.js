/*
 * GET home page.
 */

var users = require('../models/users');
var stories = require('../models/stories');

// ログイン処理を行う
exports.login = function (req, res) {
debugger;
  var name = req.body.name || '';
  var password = '';

  // GETリクエストに対する処理
  res.render('login', {
    page: { title: 'login' },
//    user: req.session.user || null,
    name: name,
    error: 200,
    loginFailed: false
  });
  return;
};

// ログインフォームを処理する
exports.login.post = function (req, res) {
debugger;
  var name = req.body.name || '';
  var password = req.body.password || '';
    
  function authCallback(err, userInfo) {
    if (err || userInfo === null) {
      // 認証に失敗
      res.render('login', {
        page: { title: 'login' },
//        user: req.session.user || null,
	name: name,
	error: 200,
	loginFailed: true
      });
      return;
    }
    // 認証に成功
/*    req.session.user = {
      uid: userInfo.uid,
      name: userInfo.name
    };*/
    res.redirect('/');
    return;
  }

  users.authenticate(name, password, authCallback);
};

// ログアウトを行う
exports.logout = function(req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
}

//記事の作成
exports.create = function(req, res) {
/*  if (req.session.user === undefined) {
    res.redirect(403, '/');
    return;
  }*/
  res.render('create-story', {
    story: {},
    page: { title: 'New Story' },
//    user: req.session.user,
    error: 200,
  });
}

// 記事の作成フォームを受け付ける
exports.create.post = function(req, res) {
//  if (req.session.user === undefined) {
//    res.redirect(403, '/');
//    return;
//  }
  var story = {};
  story.title = req.body.title;
  story.slug = req.body.slug;
  story.body = req.body.body;

  stories.insert(story, function (err) {
    if (err) {
      res.send(500);
      return;
    }
    res.redirect('/');
  });
};

// インデックスページの表示
exports.index = function(req, res){
  var pageNum = Number(req.query.page) || 1;
  var count = 5;
  var skip = count * (pageNum - 1);

  // 次ページがあるかどうかを判断するため、count+1件を取得する
  stories.getLatest(count + 1, skip, function (err, items){
    if (err) {
      res.send(500);
      console.log('cannot retrive stories');
      console.log(err);
      return;
    }

    // 取得された記事数がcountよりも多ければ次ページがある
    var nextPage = null;
    if (items.length > count) {
      nextPage = '/?page=' + (pageNum + 1);
      items.pop();
    }
    // skipしていれば前ページがある
    var previousPage = null;
    if (skip > 0) {
      if (pageNum == 2) {
        previousPage = '/';
      } else {
        previousPage = '/?page=' + (pageNum - 1);
      }
    }

    // テンプレートに与えるパラメータ
    var params = {
      page: {
        title: 'nblog',
        next: nextPage,
        previous: previousPage
      },
//      user: req.session.user || null,
      stories: items,
      request: req
    };
debugger;
    console.log('--------- params ---------');
    console.log(params);
debugger;
    res.render('index', params);
  });
};

// 単一記事の表示
exports.single = function(req, res){
  stories.getBySlug(req.params.slug, function (err, item){
    if (err) {
      res.send(500);
      console.log('cannot retrive stories');
      console.log(err);
      return;
    }
    if (item === null) {
      res.send(404);
      return;
    }
    res.render('single', {
      page: { title: 'nblog' },
//      user: req.session.user || null,
      story: item
    });
  });
};

