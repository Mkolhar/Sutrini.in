package com.sutrini.service.impl;

import com.sutrini.model.Address;
import com.sutrini.repository.AddressRepository;
import com.sutrini.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public List<Address> getAddressesByUserId(String userId) {
        return addressRepository.findByUserIdAndActiveTrue(userId);
    }

    @Override
    public Address addAddress(Address address) {
        // If default, unset other defaults
        if (address.isDefault()) {
            unsetDefaults(address.getUserId());
        }
        return addressRepository.save(address);
    }

    @Override
    public Address updateAddress(String id, Address addressDetails) {
        Address address = getAddressById(id);

        address.setFullName(addressDetails.getFullName());
        address.setStreetAddress(addressDetails.getStreetAddress());
        address.setAptSuite(addressDetails.getAptSuite());
        address.setCity(addressDetails.getCity());
        address.setState(addressDetails.getState());
        address.setPostalCode(addressDetails.getPostalCode());
        address.setCountry(addressDetails.getCountry());
        address.setPhoneNumber(addressDetails.getPhoneNumber());
        address.setLatitude(addressDetails.getLatitude());
        address.setLongitude(addressDetails.getLongitude());

        if (addressDetails.isDefault()) {
            unsetDefaults(address.getUserId());
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

        return addressRepository.save(address);
    }

    @Override
    public void deleteAddress(String id) {
        Address address = getAddressById(id);
        address.setActive(false); // Soft Delete
        addressRepository.save(address);
    }

    @Override
    public Address getAddressById(String id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with id: " + id));
    }

    private void unsetDefaults(String userId) {
        List<Address> addresses = addressRepository.findByUserIdAndActiveTrue(userId);
        for (Address addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}
