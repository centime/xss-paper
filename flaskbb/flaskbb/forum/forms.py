# -*- coding: utf-8 -*-
"""
    flaskbb.forum.forms
    ~~~~~~~~~~~~~~~~~~~~

    It provides the forms that are needed for the forum views.

    :copyright: (c) 2014 by the FlaskBB Team.
    :license: BSD, see LICENSE for more details.
"""
from flask.ext.wtf import Form
from wtforms import (TextAreaField, StringField, SelectMultipleField,
                     BooleanField)
from wtforms.validators import DataRequired, Optional, Length

from flaskbb.forum.models import Topic, Post, Report, Forum
from flaskbb.user.models import User


class QuickreplyForm(Form):
    content = TextAreaField("Quickreply", validators=[
        DataRequired(message="You cannot post a reply without content.")])

    def save(self, user, topic):
        post = Post(**self.data)
        return post.save(user=user, topic=topic)


class ReplyForm(Form):
    content = TextAreaField("Content", validators=[
        DataRequired(message="You cannot post a reply without content.")])

    track_topic = BooleanField("Track this topic", default=False, validators=[
        Optional()])

    def save(self, user, topic):
        post = Post(content=self.content.data)

        if self.track_topic.data:
            user.track_topic(topic)
        return post.save(user=user, topic=topic)


class NewTopicForm(ReplyForm):
    title = StringField("Topic Title", validators=[
        DataRequired(message="A topic title is required")])

    content = TextAreaField("Content", validators=[
        DataRequired(message="You cannot post a reply without content.")])

    track_topic = BooleanField("Track this topic", default=False, validators=[
        Optional()])

    def save(self, user, forum):
        topic = Topic(title=self.title.data)
        post = Post(content=self.content.data)

        if self.track_topic.data:
            user.track_topic(topic)
        return topic.save(user=user, forum=forum, post=post)


class ReportForm(Form):
    reason = TextAreaField("Reason", validators=[
        DataRequired(message="Please insert a reason why you want to report \
                              this post")
    ])

    def save(self, user, post):
        report = Report(**self.data)
        return report.save(user, post)


class UserSearchForm(Form):
    search_query = StringField("Search", validators=[
        Optional(), Length(min=3, max=50)
    ])

    def get_results(self):
        query = self.search_query.data
        return User.query.whoosh_search(query)


class SearchPageForm(Form):
    search_query = StringField("Criteria", validators=[
        DataRequired(), Length(min=3, max=50)])

    search_types = SelectMultipleField("Content", validators=[
        DataRequired()], choices=[('post', 'Post'), ('topic', 'Topic'),
                                  ('forum', 'Forum'), ('user', 'Users')])

    def get_results(self):
        # Because the DB is not yet initialized when this form is loaded,
        # the query objects cannot be instantiated in the class itself
        search_actions = {
            'post': Post.query.whoosh_search,
            'topic': Topic.query.whoosh_search,
            'forum': Forum.query.whoosh_search,
            'user': User.query.whoosh_search
        }

        query = self.search_query.data
        types = self.search_types.data
        results = {}

        for search_type in search_actions.keys():
            if search_type in types:
                results[search_type] = search_actions[search_type](query)

        return results
