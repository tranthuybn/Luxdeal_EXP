export const statusCampaign = (status) => {
    switch (status) {
      case -1:
        return 'status--cancel';
      case 0:
        return 'status--initial';
      case 1:
        return 'status--pending';
      case 2:
        return 'status--pending-edit';
      case 3:
        return 'status--active';
      case 4:
        return 'status--ending';
      case 41:
        return 'status--sent-voucher';
      default:
        return '';
    }
  }

export const statusService = (status) => {
    switch (status) {
      case 0:
        return 'status--initial';
      case 1:
        return 'status--approval';
      case 2:
        return 'status--transacted';
      case 3:
        return 'status--accounted';
      case 4:
        return 'status--cancel';
      default:
        return '';
    }
}

export const renderStatus = (status) => {
  switch (status) {
    case 1:
      return 'box_2';
    case 2:
      return 'box_1';
    case 3:
      return 'box_4';
    default:
      return '';
  }
}