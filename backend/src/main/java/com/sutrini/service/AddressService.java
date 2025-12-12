package com.sutrini.service;

import com.sutrini.model.Address;
import java.util.List;

public interface AddressService {
    List<Address> getAddressesByUserId(String userId);

    Address addAddress(Address address);

    Address updateAddress(String id, Address address);

    void deleteAddress(String id);

    Address getAddressById(String id);
}
