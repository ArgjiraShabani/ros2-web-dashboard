const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});

ros.on('connection', function () {
    document.getElementById('status').innerText =
        'Connected to ROS';
});

ros.on('error', function () {
    document.getElementById('status').innerText =
        'Connection Error';
});

ros.on('close', function () {
    document.getElementById('status').innerText =
        'Connection Closed';
});

const odomTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/odom',
    messageType: 'nav_msgs/msg/Odometry'
});

odomTopic.subscribe(function(message) {
    console.log("ODOM:", message);

    const x = message.pose.pose.position.x.toFixed(2);
    const y = message.pose.pose.position.y.toFixed(2);

    document.getElementById('odom').innerText =
        `Position: x=${x}, y=${y}`;
});