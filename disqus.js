import disqus from 'api/disqus';

import { lrc } from 'constants/lr';
import article from 'mock/drucker_v_nemocnici';
import { getScoreOfArticle } from 'services/article';

let users = [];
const usernames = [];

const onlyUnique = (value, index, self) => self.indexOf(value) === index;

const getPosts = new Promise(resolve => {
  disqus({
    route: 'posts/list',
    params: {
      thread: 'link:http://www.topky.sk/cl/10/1692017/PRAVE-TERAZ-Sud-prepustil-exsefa-Drukosu-Frantiska-Mojzisa',
      forum: 'topky',
    },
  })
    .then(res => resolve(res.data.response));
});

const getUserDetails = ({ username }) => new Promise(resolve => {
  disqus({
    route: 'users/details',
    params: {
      user: `username:${username}`,
    },
  }).then(res => {
    const user = {};
    const { response } = res.data;

    user.name = response.username;
    user.rep = response.rep;
    user.numFollowers = response.numFollowers;
    user.numOfLikes = response.numLikesReceived;
    user.numberOfPosts = 0;
    user.webPopularity = response.numLikesReceived / response.numPosts;

    users.push(user);
    usernames.push(user.name);
    resolve(user);
  });
});

getPosts.then(posts => {
  const usersPromises = posts.map(post =>
    getUserDetails({ username: post.author.username })
      .then(user => user));

  Promise.all(usersPromises)
    .then(() => {
      users = users.map(user => {
        let newUser = { posts: [], charCount: 0, avgCharCount: 0 };
        if (usernames.includes(user.name)) {
          newUser = { ...user, ...newUser, numberOfPosts: user.numberOfPosts + 1 };
        } else {
          newUser = { ...user };
        }

        posts.map(post => {
          if (post.author.username === user.name) {
            newUser = {
              ...newUser,
              posts: [...newUser.posts, { body: post.raw_message, parent: post.parent || undefined }],
            };
          }
        });

        return newUser;
      });


      users = users.map(user => user.posts.map(post => ({
        ...user,
        charCount: user.charCount + post.body.length,
        commentPosition: post.parent ? 1 : 0,
      })));


      users = users.map(user => ({
        ...user[0],
      }));

      users = users.map(user => ({
        ...user,
        numberOfPosts: user.posts.length,
      }));

      users = users.map(user => ({
        ...user,
        avgCharCount: user.charCount / user.numberOfPosts,
      }));

      users = users.map(user => {
        const y =
          lrc.C1 * user.rep +
          lrc.C2 * user.commentPosition +
          lrc.C3 * user.webPopularity +
          lrc.C4 * user.numberOfPosts +
          lrc.C5 * user.avgCharCount +
          lrc.C6 * user.numFollowers;


          // y pred upravou do intervalu
          // console.log(y);

        const pocet = y.toString().split('.')[0].length - 1;

        let vahovaneYpsilon = y;
        for (let i = 0; i < pocet; i++) {
          vahovaneYpsilon /= 10;
        }

        return {
          ...user,
          rating: vahovaneYpsilon.toFixed(5),
          yPredUpravou: y,
        };
      });

      // vypis y (bez uvahy clanku)
      // users.map(user => console.log(user.rating));

      const finalScoreOfArticle = getScoreOfArticle(article);
      users = users.map(user => {
        const rating = (finalScoreOfArticle * user.rating) / 100;
        return {
          ...user,
          rating: rating.toFixed(5),
        };
      });

      let ratings = users.map(user => user.rating);
      ratings = ratings.filter(onlyUnique);

      // vypis finalnych ratingov
      // console.log(ratings);

      // vypis uzivatelov a postov
      // users.map(user => { console.log(user); });

      // vypis finalneho skore artiklu
      // console.log(finalScoreOfArticle);

      // vypis autorov a hodnoty y
      users.map(user => { console.log({ name: user.name, y: user.rating }); });
    });
});
