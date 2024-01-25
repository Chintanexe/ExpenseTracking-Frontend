import React, { useState } from 'react';
import {Card, CardContent, Typography, IconButton, Grid, Chip, Paper} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {BACKEND_LINK} from "../backend-link";
import axios from "axios";
import ColoredChips from "./coloredchips";

const ExpenseCard = ({ expense, onDelete }) => {
    const {
        id,
        expenseDate,
        price,
        name,
        description,
        category,
        // username,
        users,
        splitCount,
    } = expense;

    return (
        <Grid item xs={12} sm={4}>
            <Card style={{ position: 'relative' }}>
                <IconButton
                    style={{ position: 'absolute', top: 0, right: 0, color: '#F44336' }}
                    onClick={() => onDelete(id)}
                >
                    <DeleteIcon />
                </IconButton>
                <CardContent>
                    <Typography variant="h6"><b>Expense ID: </b> {id}</Typography>
                    <Typography variant="subtitle1"><b>Date: </b>{new Date(expenseDate).toDateString()}</Typography>
                    <Typography variant="subtitle1"><b>Price: </b>
                        <Chip label={`$ ${price.toFixed(2)}`} color="success" size={"small"}/>
                    </Typography>
                    <Typography variant="subtitle1"><b>You Owe: </b>
                        <Chip label={`$ ${(price / splitCount).toFixed(2)}`} color="primary" size={"small"} />
                    </Typography>
                    <Typography variant="subtitle1"><b>Name: </b>{name}</Typography>
                    <Typography variant="subtitle1"><b>Description: </b>{description}</Typography>
                    <Typography variant="subtitle1"><b>Category: </b>{category}</Typography>
                    <Typography variant="subtitle1"><b>Owed By: </b> <ColoredChips users={users} /> </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

const ExpenseList = ({ expenses, user, money, loadPage }) => {
    const [expenseList, setExpenseList] = useState(expenses);

    const handleDelete = async (id) => {
        const updatedList = expenseList.filter((expense) => expense.id !== id);
        const result = await axios.delete(`${BACKEND_LINK}api/expenses/${id}`, { headers: {
            Authorization: user.token
        }})
        if (result.status !== 200) alert("DELETION FAILED")
        setExpenseList(updatedList);
        await loadPage();
    };

    return (
        <>
            <Grid container>
                <Paper elevation={3} style={{ padding: 16, marginBottom: 10 }}>
                    <Typography variant="h6" gutterBottom>
                        Total Money Spent
                    </Typography>
                    <Typography variant="h4" color="primary">
                        ${money}
                    </Typography>
                </Paper>
            </Grid>
            <Grid container spacing={2}>
                {expenseList.map((expense) => (
                    <ExpenseCard key={expense.id} expense={expense} onDelete={handleDelete} />
                ))}
            </Grid>
        </>
    );
};

export default ExpenseList;
