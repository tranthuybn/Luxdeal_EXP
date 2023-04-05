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

