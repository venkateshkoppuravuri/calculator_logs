import { useEffect, useState } from 'react';
import Calculator from './components/Calculator/Calculator';
import Logs from './components/Logs/Logs';
import { socket } from "./socket";

function App() {
  const [logs, setLogs] = useState([]);

  // on change of logs and on emitof the equals update the logs
  useEffect(() => {
    // receiving the socket event from the server
    socket.on("emitted-equals", (log) => {
      const newLogs = [...logs];
      newLogs.unshift(log);
      setLogs(newLogs);
    })
  }, [logs]);

  return (
    <>
      <Calculator setLogs={setLogs} />
      <Logs logs={logs} />
    </>
  );
}

export default App;
