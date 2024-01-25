import React from 'react';
import { Chip } from '@mui/material';

const ColoredChips = ({ users }) => {
    // Split the comma-separated usernames into an array
    const userArray = users.split(',');

    // Define an array of colors for the chips
    const chipColors = ['#f44336', '#2196f3', '#4caf50', '#ff9800', '#673ab7'];

    return userArray.map((user, index) => (
            <Chip
                key={user}
                size="small"
                label={user.trim()} // Remove leading/trailing whitespaces
                style={{
                    backgroundColor: 'white',
                    border: `2px solid ${chipColors[index % chipColors.length]}`,
                    color: chipColors[index % chipColors.length],
                    margin: '2px',
                }}
            />
        )
    );
};

export default ColoredChips;
