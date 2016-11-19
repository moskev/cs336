var CommentBox = React.createClass({
    getInitialState: function() {
        return {data: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
        })
         .done(function(result){
             this.setState({data: result});
         }.bind(this))
         .fail(function(xhr, status, errorThrown) {
             this.setState({data: comments});
             console.error(this.props.url, status, errorThrown.toString());
         }.bind(this));
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>People</h1>
                <CommentList data={this.state.data} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment) {
            return (
                <Comment id={comment.firstName} key={comment._id}>
                    {comment.id}
                    {comment.firstName}
                    {comment.lastName}
                    {comment.startDate}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {id: '', 
        firstName: '', 
        lastName: '', 
        startDate: ''};
    },
    handleIdChange: function(e) {
        this.setState({id: e.target.value});
    },
    handleFirstNameChange: function(e) {
        this.setState({firstName: e.target.value});
    },
    handleLastNameChange: function(e) {
        this.setState({lastName: e.target.value});
    },
    handleStartDateChange: function(e) {
        this.setState({startDate: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var id = this.state.id.trim();
        var firstName = this.state.firstName.trim();
        var lastName = this.state.lastName.trim();
        var startDate = this.state.startDate;
        if (!id || !firstName || !lastName || !startDate) {
            return;
        }
        this.props.onCommentSubmit({id: id, firstName: firstName, lastName: lastName, startDate: startDate});
        this.setState({id: '', firstName: '', lastName: '', startDate: ''});
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input className="ui-widget ui-corner-all" type="text" placeholder="ID"
                    value={this.state.id}
                    onChange={this.handleIdChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="First Name"
                    value={this.state.firstName} onChange={this.handleFirstNameChange}
                />
                <input className="ui-widget ui-corner-all" type="text" placeholder="Last Name"
                    value={this.state.lastName} onChange={this.handleLastNameChange}
                />
                <input className="ui-widget ui-corner-all" type="date" placeholder="Start Date"
                    value={this.state.startDate} onChange={this.handleStartDateChange}
                />
                <input className="ui-button ui-widget ui-corner-all" type="submit" value="Post" />
            </form>
        );
    }
});


var Comment = React.createClass({
    rawMarkup: function() {
        var md = new Remarkable({html: true});
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    },
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor" >
                    {this.props.id}
                </h2>
                <span dangerouslySetInnerHTML={this.rawMarkup()} />
            </div>
        );
    }
});


ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);