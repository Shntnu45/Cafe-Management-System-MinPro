import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { userService } from "../../services/userService";
import { toast } from 'react-toastify';

export function Account({ user }) {
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const response = await userService.getUserProfile();
            setUserData(response.user || {});
        } catch (error) {
            // Fallback to localStorage if API fails
            const savedUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (savedUser) {
                setUserData(savedUser);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await userService.updateUserProfile(userData);
            localStorage.setItem("loggedInUser", JSON.stringify(userData));
            setIsEditing(false);
            toast.success("Account details updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <Container className="py-4 text-center">
                <h2>Loading profile...</h2>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light text-center">
                            <div className="mb-3">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    alt="Profile Avatar"
                                    className="rounded-circle"
                                    width="80"
                                    height="80"
                                />
                            </div>
                            <h2 className="fw-bold mb-0">My Account</h2>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Name</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="text"
                                            value={userData.name || ""}
                                            onChange={(e) =>
                                                setUserData({ ...userData, name: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <Form.Control
                                            type="text"
                                            value={userData.name || "Not Provided"}
                                            readOnly
                                            className="bg-light"
                                        />
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    {isEditing ? (
                                        <Form.Control
                                            type="email"
                                            value={userData.email || ""}
                                            onChange={(e) =>
                                                setUserData({ ...userData, email: e.target.value })
                                            }
                                        />
                                    ) : (
                                        <Form.Control
                                            type="email"
                                            value={userData.email || "Not Provided"}
                                            readOnly
                                            className="bg-light"
                                        />
                                    )}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Role</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={userData.role || "User"}
                                        readOnly
                                        className="bg-light text-capitalize"
                                    />
                                </Form.Group>
                            </Form>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="success"
                                        className="me-2"
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            )}
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
