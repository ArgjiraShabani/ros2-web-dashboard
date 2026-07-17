// Create a connection to the ROS bridge server using WebSockets.
const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'
});


// Update the dashboard when the connection status changes.
ros.on('connection', function () {
    document.getElementById('status').innerText = 'Connected to ROS';
});

ros.on('error', function () {
    document.getElementById('status').innerText = 'Connection Error';
});

ros.on('close', function () {
    document.getElementById('status').innerText = 'Connection Closed';
});

// Subscribe to the /odom topic to receive the robot's
// position and velocity information.
const odomTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/odom',
    messageType: 'nav_msgs/msg/Odometry'
});

odomTopic.subscribe(function(message) {

    // Extract position and velocity values.
    const x = message.pose.pose.position.x.toFixed(2);
    const y = message.pose.pose.position.y.toFixed(2);
    const linear = message.twist.twist.linear.x.toFixed(2);
    const angular = message.twist.twist.angular.z.toFixed(2);


    
    // Update the dashboard.
    document.getElementById("pos-x").innerText = x;
    document.getElementById("pos-y").innerText = y;
    document.getElementById("linear-velocity").innerText = linear;
    document.getElementById("angular-velocity").innerText = angular;
});



// Subscribe to the IMU topic and display the
// robot's acceleration values.
const imuTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/imu',
    messageType: 'sensor_msgs/msg/Imu'
});

imuTopic.subscribe(function(message) {
    document.getElementById("imu-status").innerText = "Active";

    // Display linear acceleration values.
    document.getElementById("accel-x").innerText =
        message.linear_acceleration.x.toFixed(2);
    document.getElementById("accel-y").innerText =
        message.linear_acceleration.y.toFixed(2);
    document.getElementById("accel-z").innerText =
        message.linear_acceleration.z.toFixed(2);
});

// Subscribe to the laser scanner topic and display
// the sensor status and number of measurements.

const scanTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/scan',
    messageType: 'sensor_msgs/msg/LaserScan'
});

scanTopic.subscribe(function(message) {
    document.getElementById("lidar-status").innerText = "Active";

    // Display the number of laser measurements.
    document.getElementById("scan-count").innerText = message.ranges.length;
});

// Publish movement commands to the /cmd_vel topic.
const cmdVel= new ROSLIB.Topic({
    ros: ros,
    name: '/cmd_vel',
    messageType: 'geometry_msgs/msg/Twist'
});

// Create and publish a Twist message containing
// linear and angular velocity values.

function publishVelocity(linearX, angularZ){
    const twist= new ROSLIB.Message({
        linear:{
            x: linearX,
            y: 0.0,
            z: 0.0

        },
        angular:{
            x: 0.0,
            y: 0.0,
            z: angularZ
        }
    });
    cmdVel.publish(twist);
}

// Each button calls one of these functions to send
// a predefined movement command.

function moveForward(){
    publishVelocity(0.2,0.0);
}
function moveBackward(){
    publishVelocity(-0.2,0.0);
}
function turnLeft(){
    publishVelocity(0.0,0.5);
}
function turnRight(){
    publishVelocity(0.0,-0.5);
}
function stopRobot(){
    publishVelocity(0.0,0.0);
}

