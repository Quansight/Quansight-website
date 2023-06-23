---
title: 'Learn NixOS by turning a Raspberry Pi into a Wireless Router'
published: July 11, 2020
author: [anthony-scopatz]
description: 'I recently moved, and my new place has a relatively small footprint. (Yes, I moved during the COVID-19 pandemic. And yes, it was crazy.) I quickly realized that was going to need a wireless router of some sort, or more formally, a wireless access point (WAP).'
category: [Beyond PyData]
featuredImage:
  src: /posts/nixos-rpi-wifi-router/feature.png
  alt: 'A code snippet of how to set up a wireless DNS with NixOS.'
hero:
  imageSrc: /posts/nixos-rpi-wifi-router/blog_hero_var2.svg
  imageAlt: 'An illustration of a dark brown hand holding up a microphone, with some graphical elements highlighting the top of the microphone.'
---

I recently moved, and my new place has a relatively small footprint.  (Yes, I
moved during the COVID-19 pandemic. And yes, it was crazy.) I quickly realized
that was going to need a wireless router of some sort, or more formally, a wireless
access point (WAP). Using my Ubuntu laptop's "wireless hotspot" capability was a
nice temporary solution, but it had a few serious drawbacks.

## Drawbacks of hotspotting with a laptop

* The wireless internet goes out whenever I would travel with the laptop,
* The laptop had to be close to the modem, so that it could be plugged into
  ethernet, making my laptop not even portable *within* the apartment,
* The SSID was my laptop's hostname,
* The WPA password would be set to a random string whenever the hotspot
  was started, and so
* Whenever I moved my laptop I would also need to reset the credentials
  on all of my wireless devices!

Additionally, some of my coworkers are [Nix](https://nixos.org) true believers.
While I had read the NixOS docs, I had never actually taken it for a spin.
Consider this my first few steps down the `/etc/nixos` path, because, while
I lacked a WiFi router, I did have an errant Raspberry Pi 3B+ lying around...

## Too Long; Didn't Read

Be sure to fill out the SSID and WPA passphrase in the file below.

**/etc/nixos/configuration.nix**

```nix
{ config, pkgs, lib, .}:
{
  # NixOS wants to enable GRUB by default
  boot.loader.grub.enable = false;
  # Enables the generation of /boot/extlinux/extlinux.conf
  boot.loader.generic-extlinux-compatible.enable = true;

  # use an older kernel, so that we can actually boot
  boot.kernelPackages = pkgs.linuxPackages_4_19;

  # Needed for the virtual console to work on the RPi 3, as the default of 16M
  # doesn't seem to be enough. If X.org behaves weirdly (I only saw the cursor)
  # then try increasing this to 256M.
  boot.kernelParams = ["cma=32M"];

  # File systems configuration for using the installer's partition layout
  fileSystems = {
    "/" = {
      device = "/dev/disk/by-label/NIXOS_SD";
      fsType = "ext4";
    };
  };

  # Recommended swap file is optional
  swapDevices = [ { device = "/swapfile"; size = 1024; } ];

  # packages
  environment.systemPackages = with pkgs; [ hostapd dnsmasq bridge-utils ];

  # add wireless service
  hardware.enableRedistributableFirmware = true;
  networking.wireless.enable = true;

  # set up wireless access point
  networking.networkmanager.unmanaged = [ "interface-name:wlan*" ]
    ++ lib.optional config.services.hostapd.enable "interface-name:${config.services.hostapd.interface}";
  services.hostapd = {
    enable = true;
    interface = "wlan0";
    hwMode = "g";
    ssid = "<YOUR NETWORK NAME HERE>";
    wpaPassphrase = "<YOUR PASSWORD HERE>";
  };

  # set up wireless static IP address
  networking.interfaces.wlan0.ip4 = lib.mkOverride 0 [ ];
  networking.interfaces.wlan0.ipv4.addresses =
    lib.optionals config.services.hostapd.enable [{ address = "192.168.0.1"; prefixLength = 24; }];

  # set up wireless DNS
  services.dnsmasq = lib.optionalAttrs config.services.hostapd.enable {
    enable = true;
    extraConfig = ''
      interface=wlan0
      bind-interfaces
      dhcp-range=192.168.0.10,192.168.0.254,24h
    '';
  };
  networking.firewall.allowedUDPPorts = lib.optionals config.services.hostapd.enable [53 67];
  services.haveged.enable = config.services.hostapd.enable;

  # Finally, bridge ethernet and wifi
  networking.bridges.br0.interfaces = [ "eth0" "wlan0" ];
}
```

## Learning to use Nix

Nix is great! Its mental model is really neat and there are some fantastic
ideas under the covers. However, the documentation has some glaring holes.
It almost all cases it either assumes that:

1. You already know how to use Nix, or
2. You already are on a Nix machine.

This makes it very frustrating to actually get started, especially on non-standard
hardware such as the Raspberry Pi. A lot of these issues can be smoothed over by a
friend who can act as your spirit guide. I write this as someone who has been a
Linux user for 20 years and who works on open source packaging problems
([conda-forge](https://conda-forge.org)).

The following are some basic Nix tips for helping get you started.

### Don't use `nix-env`

The first bit of philosophy to understand is that while much of the Nix documentation
touts the *functional* nature of its underlying language, the important aspect of Nix
is that it is *declarative*.

Nix wants you to specify the configuration and layout of your Operating System (OS)
ahead of time in a relatively static way. This is very different from how other
Linux distributions operate, which assume that you will *procedurally* build
up your system from various available components, as needed. The declarative
approach has advantages & disadvantages.

**Advantages:**

* You can write out exactly what your OS is in a single text file (see above).
* Your OS can be built and tested before booting into it.
* Errors in configuration are caught and tested during the build process.

**Disadvantages:**

* You have to know what you want in your OS before you build it.
* Changes to the OS configuration require a rebuild.

In many cases, the advantages here outweigh the disadvantages. It is without
question that [Docker](https://www.docker.com/), [CoreOS](http://coreos.com/),
and [conda](https://docs.conda.io/en/latest/) all owe a lot of conceptual
inspiration to the work Nix has been performing for years.

Of course, even a functional OS has to have an escape valve. This is called
`nix-env` and is a command line utility for creating & managing environments
(a collection of packages) in an existing OS.

!!! warning
    Do not use `nix-env`!

We want to create a dedicated device that, when it boots up, is a WAP. To this
end, it is important that we declare everything in the configuration file.
If we start creating environments willy-nilly, we won't obtain the proper
boot behavior. This is very different from procedural OSes, where you can
modify live configuration files that affect boot processes. Not so here!
All boot config needs to be declared!

(Unfortunately, much of the Nix documentation uses `nix-env`, because it
assumes that you are a user on an existing Nix box just trying things out.)

### The configuration.nix file

So where does this mysterious OS configuration file live? Well, the full path
to this file is `/etc/nixos/configuration.nix`. It is written in the Nix language,
and is used by the `nixos-rebuild` command line tool. We'll see this tool later
to build the router's OS.

Again, unfortunately, when people report bugs or list a configuration snippet,
they are almost always referring to this file. However, they don't specify that
they are talking about this file. It is just known.

Now you know too.

### You need to be root (which is shockingly easy)

Another issue that is not clear from the docs is that any serious command you might
want to run needs to be run as root (or another user in the wheel group). However,
the default `aarch64` image boots into a user named `nixos`. This requires you to
`sudo su` to become the root user to run rebuild commands (or any of the commands
prefixed by `sudo`).

Also, oddly, in the initial image neither the `nixos` nor the `root` user have passwords.
So you end up running `sudo` without needing a password. You will probably want to set a
password with the `passwd` utility, or via user management in `/etc/nixos/configuration.nix`.

## First Boot!

Assuming you have the SD card for your Raspberry Pi handy, take it out of the Pi and
plug it into another (Linux) computer. We are going to need to flash it with a basic
NixOS. You can find generic instructions for
[NixOS on a Raspberry PI here](https://nixos.wiki/wiki/NixOS_on_ARM/Raspberry_Pi) and
instructions for [NixOS on ARM here](https://nixos.wiki/wiki/NixOS_on_ARM). However,
I'll summarize the important bits here.

**First**, go to
[the 19.09 aarm64 landing page](https://hydra.nixos.org/job/nixos/release-19.09/nixos.sd_image.aarch64-linux)
and download the latest NixOS image. It will be called something like
`nixos-sd-image-19.09.2435.9642f121eb1-aarch64-linux.img`. We'll assume this is in
your `~/Downloads` folder.

**Second**, figure out what device your SD card is. If you just plugged it in, you
can determine this by looking at the end of the output of the `dmesg` command.
For example,

```sh
$ dmesg
[ 4591.053095] usb 3-10: new high-speed USB device number 5 using xhci_hcd
[ 4591.201911] usb 3-10: New USB device found, idVendor=14cd, idProduct=168a, bcdDevice= 0.01
[ 4591.201915] usb 3-10: New USB device strings: Mfr=1, Product=3, SerialNumber=2
[ 4591.201917] usb 3-10: Product: USB Mass Storage Device
[ 4591.201919] usb 3-10: Manufacturer: USB Device
[ 4591.201921] usb 3-10: SerialNumber: 816820130806
[ 4591.202955] usb-storage 3-10:1.0: USB Mass Storage device detected
[ 4591.203140] scsi host10: usb-storage 3-10:1.0
[ 4592.205933] scsi 10:0:0:0: Direct-Access     USB Mass  Storage Device  1.00 PQ: 0 ANSI: 0
[ 4592.206338] sd 10:0:0:0: Attached scsi generic sg1 type 0
[ 4592.207288] sd 10:0:0:0: [sdb] 31116288 512-byte logical blocks: (15.9 GB/14.8 GiB)
[ 4592.207421] sd 10:0:0:0: [sdb] Write Protect is off
[ 4592.207425] sd 10:0:0:0: [sdb] Mode Sense: 03 00 00 00
[ 4592.207561] sd 10:0:0:0: [sdb] No Caching mode page found
[ 4592.207567] sd 10:0:0:0: [sdb] Assuming drive cache: write through
[ 4592.212993]  sdb: sdb1 sdb2
[ 4592.214220] sd 10:0:0:0: [sdb] Attached SCSI removable disk
```

This let's us know that the SD card is the `/dev/sdb` device and has two partitions.
Yours might be called `/dev/sdc` or something similar. It also might have more than
two partitions. That is totally normal at this step.

**Third**, we need to copy the NixOS image over to the SD card. We'll do this with
the `dd` command. The SD card should *not* be mounted right now. Run the following
command with the path to the image and the SD card device replaced as appropriate.

```sh
$ sudo dd if=~/Downloads/nixos-sd-image-19.09.2435.9642f121eb1-aarch64-linux.img of=/dev/sdb
```

Great! At this point, we have now flashed the SD card with our new NixOS!

**Fourth**, it will save us a lot of typing if we copy over an existing
configuration file to the SD card. Copy the text of the
`/etc/nixos/configuration.nix` file at the top of this article to a new file,
let's call it `~/Downloads/config.nix`. Fill in this file with the SSID and
password that you want your network to have. Then, run the following commands
to copy the configuration file to the SD card. Again, modify the paths here
as needed.

```sh
$ mkdir -p ~/mount
$ sudo mount /dev/sdb2 ~/mount
$ sudo mkdir -p ~/mount/etc/nixos
$ sudo cp ~/Downloads/config.nix ~/mount/etc/nixos/configuration.nix
$ sudo umount ~/mount
```

**Fifth**, now unplug the SD card from your main machine, plug it into the
Raspberry Pi! Attach the ethernet, keyboard, monitor, and power supply to the
Pi you will be booting up into your first NixOS! 🎉

## Build the Router OS

The operating system that we have just booted into on the Raspberry Pi is a
generic image that does not use the configuration file that we copied over.
We need the Nix tools to be able to build the image. Luckily, we are now on
a Nix machine!

**Sixth**, we need to be root to run a lot of these tools. However, we booted
into the `nixos` user. To make the rest of the process easier, let's just log
in as root with the following:

```sh
$ sudo su
```

**Seventh**, now let's verify that we have a working internet connection and
that the network devices exist. To do so, start with a simple `ping` that
should looks like`

```sh
$ ping 8.8.8.8 -c 3
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=55 time=19.1 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=55 time=19.3 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=55 time=24.2 ms

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 3ms
rtt min/avg/max/mdev = 19.098/20.847/24.154/2.345 ms
```

If you only see packet loss, then this means you do not have internet on the Pi
and you cannot proceed. Nix requires internet access to build in all realistic
scenarios.

Next run the `ifconfig` command and verify that *both* `eth0` (the ethernet device)
and `wlan0` (the wireless device) exist.

```sh
$ ifconfig
...
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 37.128.100.42  netmask 255.255.255.0
        ...
wlan0: ...
...
```

**Eighth**, we finally get to build the new OS for our router! We do this with
the `nixos-rebuild` command. All you have to do is run the following command
and watch the text scroll by.

```sh
$ nixos-rebuild switch -v
```

**Ninth**, we can now reboot into our router! Just run:

```sh
$ reboot
```

The default boot option has been changed to be the OS we just built, which is the
same as the second option in the bootloader's listing. The original image will be
the last boot option (which for various reasons says it is from 1970). This allows
us to always get back to a working NixOS to do another `nixos-rebuild` if something
went terribly wrong and we need to do another rebuild. For example, this could
happen if there was a typo in the configuration file.
*If you ever modify `/etc/nixos/configuration.nix`, you'll need to rebuild & reboot.*
The rebuild & reboot cycle is the fundamental implication of having a declarative OS.

**Tenth**, if you want to verify that everything is working on your router after
reboot, you can log in as root and run `ifconfig` again. This time, you should
see `eth0`, `wlan0`, and `br0` devices. Of course, the `ping` command should
work too.

**Eleventh**, you should now be able to connect a wireless device like a phone or
a laptop to your shiny new WAP!

## Deep dive into `configuration.nix`

For the truly inquisitive who are still reading, let's break down what the
different parts of the configuration file actually mean, and how they help
define our wireless router.

### Bootloader

```nix
boot.loader.grub.enable = false;
boot.loader.generic-extlinux-compatible.enable = true;
```

These lines are part of the standard ARM configuration and help speed up the boot
process a bit by disabling the fancy GRUB bootloader.

### Older Kernel

```nix
boot.kernelPackages = pkgs.linuxPackages_4_19;
```

This line pins our packages to use and older version of the Linux kernel (v4.19).
This is super critical because, without this line, `nixos-rebuild` will end up
grabbing a kernel in the v5.x series. Unfortunately, the Raspberry Pi 3 has
problems starting up these more recent kernels and the Pi will hang indefinitely
on boot. Using an older kernel version avoids this problem for the time being.

### Console Memory

```nix
boot.kernelParams = ["cma=32M"];
```

This line gives the console more memory than the default value of 16 MB.
The Raspberry Pi seems to need this.

### Partition Layout

```nix
fileSystems = {
  "/" = {
    device = "/dev/disk/by-label/NIXOS_SD";
    fsType = "ext4";
  };
};
```

The above specifies where the root file system lives. It is part of the
standard ARM configuration.

### Swap

```nix
swapDevices = [ { device = "/swapfile"; size = 1024; } ];
```

This line gives the machine some extra virtual memory, which is always a good idea.

### Router packages

```nix
environment.systemPackages = with pkgs; [ hostapd dnsmasq bridge-utils ];
```

Unlike procedural OSes, we list all of the packages that we need inside the
configuration file itself. This ensures that our router is running exactly
the software that we want it to. In this case, we only need three packages
to enable the Pi to act as an access point, provide a domain name service, and
bridge the ethernet and the WiFi device.

For comparison, in Ubuntu, we would install these packages after we installed
Ubuntu itself. In Nix, we install the OS and the packages at the same time!

### Enable the wireless device

```nix
hardware.enableRedistributableFirmware = true;
networking.wireless.enable = true;
```

These lines simply allow the wireless card to be used on the Raspberry Pi in
the simplest possible way.

### Set up the wireless access point

```nix
networking.networkmanager.unmanaged = [ "interface-name:wlan*" ]
  ++ lib.optional config.services.hostapd.enable "interface-name:${config.services.hostapd.interface}";
services.hostapd = {
  enable = true;
  interface = "wlan0";
  hwMode = "g";
  ssid = "<YOUR NETWORK NAME HERE>";
  wpaPassphrase = "<YOUR PASSWORD HERE>";
};
```

Because we are installing the router packages along with the OS, we *also* need
to configure these packages at the same time we configure the OS itself.
The first line here tells Nix not to use normal networking management on the
`wlan0` device. This is because we'll be managing it as a WAP ourselves.

The remaining lines configure the access point, including the SSID and password
for the wireless network.

### Set up wireless static IP address

```nix
networking.interfaces.wlan0.ip4 = lib.mkOverride 0 [ ];
networking.interfaces.wlan0.ipv4.addresses =
  lib.optionals config.services.hostapd.enable [{ address = "192.168.0.1"; prefixLength = 24; }];
```

Now, we would like the router itself to have a consistent IP address. We set
this in the second line above as `192.168.0.1`, though any value in `192.168.x.x`
would work equally well. However, just providing the static IP on its own is
not enough. This is because NixOS will verify that `wlan0` does not have an
IP address during the `nixos-rebuild` process. Since we are giving `wlan0`
an IP address, we need to turn off the IP address checking. If we do not
remove this verification, the whole OS build process will fail. The first
line in the above snippet removes this check with the `mkOverride` function.

### Set up the wireless DNS

```nix
services.dnsmasq = lib.optionalAttrs config.services.hostapd.enable {
  enable = true;
  extraConfig = ''
    interface=wlan0
    bind-interfaces
    dhcp-range=192.168.0.10,192.168.0.254,24h
  '';
};
networking.firewall.allowedUDPPorts = lib.optionals config.services.hostapd.enable [53 67];
services.haveged.enable = config.services.hostapd.enable;
```

The collection of lines above allows the `wlan0` device to operate as a
domain name server, proxying a real DNS online. It also sets the range
of IP addresses that the router will issue to other network devices.
This is seen in the `dhcp-range=192.168.0.10,192.168.0.254` portion.
The first IP address is the lowest address the router will issue, and
the second IP address is the highest.

### Bridge ethernet and wifi

```nix
networking.bridges.br0.interfaces = [ "eth0" "wlan0" ];
```

Lastly, we 'bridge' the ethernet and wireless devices. This allows network
traffic to flow through the `eth0` connection and into the `wlan0`.

## Reflections

This was a really fun weekend project! I certainly learned a lot about Nix,
Raspberry Pis, and about how to set up various parts of the Linux networking
stack that I had never explored before. My main wish in this process was that
Nix had better documentation that was more aimed at,

1. People who had never used Nix before, and
2. People who are trying to build dedicated devices.

A lot of the Nix documentation seems to be aimed at a very particular kind
of desktop user: *someone who already has Nix installed!* Such users represent
an important use case, and the nix build configurations are easy enough to read.
However, I definitely think there is on-boarding improvement work to be done in
the Nix ecosystem.

So, will I ever go back? I don't think so! This router was so cheap (~$40) and
the Raspberry Pi 3B+ is so powerful that I get amazing performance throughout
my entire apartment. If it ever breaks, the Pi will be trivial to replace.
I am really happy with what I created. Even if this little project isn't original,
it solves a real problem in my day-to-day life.

In terms of NixOS as a Linux distribution, I think I now am totally on board.
Nix has so many incredible advantages that (as a control freak who builds his
own WiFi router) I just can't ignore or give up. The feature of Ubuntu that
was keeping me on that distribution for so long was that "it just works"
© ®.

But Nix "just works" too. The only catch is that you need to know what "it" is
that you want working ahead of time. I am also comfortable with responsibly
using environments, so I think that increases my willingness to jump into a new
OS framework. I am a little worried about moving from Ubuntu to Nix on an
existing machine, but that is what external hard drive backups are for!

That is all folks! Thanks for reading 👋