import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;



public class main {
	public static void main(String[] args) throws Throwable {
		if(args.length == 1) {
			System.out.println(args[0]);
		} else if(args.length == 3) {	
			int size = Integer.parseInt(args[0]);		//  packet size
			InetAddress addr = InetAddress.getByName(args[1]);
				
			int port = Integer.parseInt(args[2]);
				
			Client[] clients = new Client[2];		//thread num : 2
			for(int i = 0; i < clients.length; i++)
				clients[i] = new Client(addr, port, size);
			
			long time = System.currentTimeMillis() + 1000;
			
			for(int i = 0; i < clients.length; i++)
				clients[i].start();
				
			while(true) {
				Thread.sleep(time - System.currentTimeMillis());
				time += 1000;
				
				int sent = 0;
				int received = 0;
				
				for(int i = 0; i < clients.length; i++) {
					int[] s = clients[i].get();
					
					sent += s[0];
					received += s[1];
				}
					
	            System.out.printf("%,d\t%,d\t%,d\t%,d\n", sent, received, (sent * size * 8), (received * size * 8));
			}
		}
	}
}
