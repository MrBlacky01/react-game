import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { Statistic } from './../../Models/Statistic';
import { LocalStorageValues } from "../../AppConstants";
interface StatisticModalProps {
    isOpened: boolean;
    onClosed: () => void;
};

export const StatisticModal: React.FC<StatisticModalProps> =(props: StatisticModalProps) => {
  
    const toggle = () => {
        if(props.onClosed){
            props.onClosed();
        }
    }
    const value = localStorage[LocalStorageValues.STATISTIC];
    const statsArray: Array<Statistic> = value ? JSON.parse(value) : [];

    return (
      <>
        <Modal isOpen={props.isOpened} size="lg">
          <ModalHeader>Statistic</ModalHeader>
          <ModalBody>
            <Table>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Field Size</th>
                    <th>Bomb Count</th>
                    <th>Result</th>
                    <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {statsArray.map((item, index) => {
                        return(
                            <tr key={'statsRow' + (index + 1)}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.width}x{item.height}</td>
                                <td>{item.bombCount}</td>
                                <td>{item.result}</td>
                                <td>{new Date(item.gameFinishedDate).toLocaleString()}</td>
                            </tr>
                        );
                    })}
                    
                </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </>
    );
}