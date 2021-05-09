import React from 'react';
import Log from './Log/Log';
import "./Logs.css";

const Logs = ({ logs }) => {

    const renderLogs = () => {
        return logs.slice(0, 10).map((log, index) => {
            return <Log key={index} expression={log.expression} userId={log.userId} />
        })
    }

    return (
        <>
            {logs.length
                ? <div className="Logs">
                        <h3>Log(s)</h3>
                        {renderLogs()}
                    </div>
                : ''
            }

        </>
    );
}

export default Logs;