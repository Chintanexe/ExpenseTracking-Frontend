import React, {useEffect, useState} from 'react';

import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    InputAdornment,
} from '@mui/material';
import axios from "axios";
import {BACKEND_LINK} from "../backend-link";
import ExpenseList from "../components/expensecard";
import {Col, Row} from "react-grid-system";
// import { PieChart } from 'react-minimal-pie-chart';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from "@mui/material/Typography";

const categories = ['Health', 'Food', 'Recreation', 'Investments', 'Clothing', 'Others'];

const RequestForm = (props) => {

    const [expenses, setExpenses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pieData, setPieData] = useState([]);
    const [money, setMoney] = useState(0);

    const loadPage = async () => {
        try {
            setLoading(true);

            const getExpenses = await axios.get(`${BACKEND_LINK}api/expenses`, {
                headers: {
                    Authorization: props.user.token,
                },
            });

            setExpenses(getExpenses.data);
            setUser(props.user);

            const tempExpense = [];
            const tempMap = {}
            let moneySpent = 0;

            for (const expense of getExpenses.data) {
                if (!tempMap[expense.category]) {
                    tempMap[expense.category] = 0;
                }
                tempMap[expense.category] += expense.price / expense.splitCount;
            }

            // const colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"];

            for (const [index, key] of Object.keys(tempMap).entries()) {
                tempExpense.push({
                    id: index,
                    label: key,
                    value: tempMap[key],
                });
                moneySpent += tempMap[key];
            }

            setMoney(Math.round(moneySpent));
            setPieData(tempExpense);

        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    const initialFormState = {
        name: '',
        description: '',
        users: '',
        price: 0,
        category: '',
    }

    const [formData, setFormData] = useState(initialFormState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await axios.post(`${BACKEND_LINK}api/expenses`, {
            name: formData.name,
            description: formData.description,
            users:  formData.users.length > 0 ? formData.users.split(',') : [],
            price: formData.price,
            category: formData.category
        } , { headers: {
            'Authorization': props.user.token
        }});

        if (result.status !== 200) {
            alert("Expense submission failed!");
            return;
        }

        await loadPage();

        setFormData(initialFormState);
    }

    useEffect( () => {
        loadPage();
        // eslint-disable-next-line
    }, [props])

    const getLabelStyle = (dataEntry) => ({
        fontSize: '50px',
        fill: 'white',
        stroke: 'white'
    });

    return (
        <>
            <Row>
                <Col sm={6}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Description"
                                variant="outlined"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Price"
                                variant="outlined"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                            />
                            <FormControl fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <FormControl fullWidth required>
                            <TextField
                                label="Add comma separated usernames if Group Expense"
                                variant="outlined"
                                name="users"
                                value={formData.users}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </FormControl>
                        <p/>
                        <Button type="submit" variant="contained" color="primary">
                            ADD EXPENSE
                        </Button>
                        <p/>
                    </form>
                </Col>
                <Col sm={6}>
                    {loading ? (
                        <div></div> // Show the loader while expenses are being fetched
                    ) : ( pieData && pieData.length > 0 &&
                        (   <>
                                <PieChart
                                    series={[{data: pieData}]}
                                    width={400}
                                    height={200}
                                />
                            </>
                        )
                    )}
                </Col>
            </Row>

            {loading ? (
                <div></div>
            ) : (
                (expenses && expenses.length > 0) && <ExpenseList expenses={expenses} user={user} money={money} loadPage={loadPage}/>
            )}
        </>
    );
};

export default RequestForm;
