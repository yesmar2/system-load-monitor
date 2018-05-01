import React from "react";
import Alert from "react-s-alert";
import Drawer from "material-ui/Drawer";
import IconButton from "material-ui/IconButton";
import List, { ListItem, ListItemIcon, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import Badge from "material-ui/Badge";
import { withStyles } from "material-ui/styles";
import "./Notifications.css";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

const styles = {
    badge: {
        background: "rgb(247, 90, 91)",
        color: "#fff"
    },
    drawerPaper: {
        width: "400px"
    }
};

class Notifications extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            newNotifications: 0
        };
    }

    componentDidUpdate(prevProps) {
        const prevNotifications = prevProps.notifications;
        const currentNotifications = this.props.notifications;

        if (prevNotifications.length !== currentNotifications.length) {
            this.setState({
                newNotifications: this.state.newNotifications + 1
            });

            if (currentNotifications[0].isThresholdAlert) {
                Alert.error(
                    `<h1>High load generation alert</h1><h2>CPU = ${
                        currentNotifications[0].cpu
                    }%</h2>`,
                    {
                        position: "top-right",
                        effect: "slide",
                        timeout: 3000,
                        html: true
                    }
                );
            } else {
                Alert.success(`<h1>High load generation alert recovered</h1>`, {
                    position: "top-right",
                    effect: "slide",
                    timeout: 3000,
                    html: true
                });
            }
        }
    }

    handleDrawerOpen = () => {
        this.setState({ open: true, newNotifications: 0 });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open, newNotifications } = this.state;
        const { notifications, classes } = this.props;

        const notificationIcon =
            newNotifications > 0 ? (
                <Badge
                    badgeContent={newNotifications}
                    classes={{
                        badge: classes.badge
                    }}
                >
                    <i className="material-icons">notifications</i>
                </Badge>
            ) : (
                <i className="material-icons">notifications</i>
            );

        let notificationList = null;
        if (notifications.length === 0) {
            notificationList = (
                <ListItem key={0}>
                    <ListItemIcon>
                        <i className="material-icons">notifications</i>
                    </ListItemIcon>
                    <ListItemText primary="No notifications" />
                </ListItem>
            );
        } else {
            notificationList = notifications.map((notification, index) => {
                const date = new Date(notification.timestamp);

                const hours = date.getHours();
                const minutes = "0" + date.getMinutes();
                const seconds = "0" + date.getSeconds();
                const formattedTime =
                    hours + ":" + minutes.substr(-2) + ":" + seconds.substr(-2);

                if (notification.isThresholdAlert) {
                    return (
                        <ListItem>
                            <ListItemIcon>
                                <i className="material-icons">warning</i>
                            </ListItemIcon>
                            <ListItemText
                                primary="High load generation alert"
                                secondary={`CPU = ${
                                    notification.cpu
                                }%, triggered at ${formattedTime}`}
                            />
                        </ListItem>
                    );
                } else {
                    return (
                        <ListItem>
                            <ListItemIcon>
                                <i className="material-icons">check_circle</i>
                            </ListItemIcon>
                            <ListItemText
                                primary="High load generation alert recovered"
                                secondary={`CPU = ${
                                    notification.cpu
                                }%, triggered at ${formattedTime}`}
                            />
                        </ListItem>
                    );
                }
            });
        }

        return (
            <div className="notifications">
                <IconButton
                    onClick={this.handleDrawerOpen}
                    style={{ color: "#fff" }}
                >
                    {notificationIcon}
                </IconButton>

                <Drawer
                    variant="persistent"
                    open={open}
                    anchor="right"
                    classes={{
                        paper: classes.drawerPaper
                    }}
                    onClose={this.handleDrawerClose}
                >
                    <IconButton onClick={this.handleDrawerClose}>
                        <i className="material-icons">chevron_right</i>
                    </IconButton>
                    <Divider />
                    <List>{notificationList}</List>
                </Drawer>
                <Alert stack={{ limit: 1 }} />
            </div>
        );
    }
}

export default withStyles(styles)(Notifications);
